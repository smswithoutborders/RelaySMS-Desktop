import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Grid2 as Grid,
  TextField,
  Typography,
  Link,
  IconButton,
  Snackbar,
  Alert as MuiAlert,
  Checkbox,
  CircularProgress,
} from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { OTPDialog } from "../Components";
import {
  SettingsController,
  createEntity,
  fetchLatestMessageWithOtp,
  fetchModems,
} from "../controllers";

function SignupPage() {
  const settingsController = new SettingsController();

  const [phone, setPhone] = useState("");
  const [phoneInfo, setPhoneInfo] = useState({});
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
    passwordError: false,
    confirmPasswordError: false,
  });
  const [showPassword, setShowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const [phoneError, setPhoneError] = useState(false);
  const [phoneErrorMessage, setPhoneErrorMessage] = useState("");
  const [alert, setAlert] = useState({
    open: false,
    type: "success",
    message: "",
  });
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [otpSettings, setOtpSettings] = useState({
    nextAttemptTimestamp: null,
    phoneNumber: null,
  });
  const [loading, setLoading] = useState(false);
  const [modemsAvailable, setModemsAvailable] = useState(false);

  const fetchOtpSettings = async () => {
    try {
      const [nextAttemptTimestamp, phoneNumber] = await Promise.all([
        settingsController.getData("preferences.otp.nextAttemptTimestamp"),
        settingsController.getData("preferences.otp.phoneNumber"),
      ]);
      setOtpSettings({ nextAttemptTimestamp, phoneNumber });
    } catch (error) {
      console.error("Error fetching OTP settings:", error);
    }
  };

  const checkModems = async () => {
    const modems = await fetchModems();
    setModemsAvailable(modems.length > 0);
  };

  useEffect(() => {
    checkModems();
    fetchOtpSettings();
  }, []);

  const handlePhoneChange = (value, info) => {
    const cleanedValue = value.replace(/\s+/g, "");
    info.countryCode = info.countryCode
      ? info.countryCode
      : phoneInfo.countryCode;
    setPhone(cleanedValue);
    setPhoneInfo(info);
    setPhoneError(false);
    setPhoneErrorMessage("");
  };

  const handlePasswordFieldChange = (event) => {
    const { name, value } = event.target;
    setPasswordData((prevState) => ({
      ...prevState,
      [name]: value,
      passwordError: name === "password" ? false : prevState.passwordError,
      confirmPasswordError:
        name === "confirmPassword" ? false : prevState.confirmPasswordError,
    }));
  };

  const handleTermsChange = (event) => {
    setAgreedToTerms(event.target.checked);
  };

  const validatePhoneNumber = () => {
    if (!phone || !phoneInfo.nationalNumber) {
      setPhoneErrorMessage("Phone number is required");
      return false;
    }

    if (!matchIsValidTel(phone)) {
      if (!phoneInfo.countryCode) {
        setPhoneErrorMessage(
          "Please select a country and enter your phone number."
        );
      } else {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        const countryName = regionNames.of(phoneInfo.countryCode);
        setPhoneErrorMessage(
          `Please enter a valid phone number for ${countryName}.`
        );
      }
      return false;
    }

    return true;
  };

  const validatePassword = () => {
    const { password, confirmPassword } = passwordData;

    if (!password) {
      setPasswordData((prevState) => ({
        ...prevState,
        passwordError: true,
      }));
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordData((prevState) => ({
        ...prevState,
        confirmPasswordError: true,
      }));
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();

    setPhoneError(false);

    await checkModems();

    const isPhoneValid = validatePhoneNumber();
    const isPasswordValid = validatePassword();

    if (!isPhoneValid || !isPasswordValid || !agreedToTerms) {
      if (!isPhoneValid) setPhoneError(true);
      return;
    }

    setLoading(true);

    try {
      const [nextAttemptTimestamp, phoneNumber] = await Promise.all([
        settingsController.getData("preferences.otp.nextAttemptTimestamp"),
        settingsController.getData("preferences.otp.phoneNumber"),
      ]);
      const now = Math.floor(Date.now() / 1000);
      if (
        nextAttemptTimestamp &&
        nextAttemptTimestamp > now &&
        phoneNumber === phone
      ) {
        const timeLeft = formatDistanceToNow(nextAttemptTimestamp * 1000, {
          includeSeconds: true,
        });
        setAlert({
          open: true,
          type: "info",
          message: `You can request a new OTP in ${timeLeft}. If you already have the OTP, please enter it in the box below.`,
        });
        setOtpDialogOpen(true);
        return;
      }

      const entityData = {
        country_code: phoneInfo.countryCode,
        phone_number: phone,
        password: passwordData.password,
      };

      const { err, res } = await createEntity(entityData);
      if (err) {
        setAlert({
          open: true,
          type: "error",
          message: err,
        });
        return;
      }

      if (res.requires_ownership_proof) {
        setAlert({
          open: true,
          type: "success",
          message: res.message,
        });
        await fetchOtpSettings();
        setOtpDialogOpen(true);
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleOtpSubmit = async (setOtpAlert, otp) => {
    try {
      const entityData = {
        country_code: phoneInfo.countryCode,
        phone_number: phone,
        password: passwordData.password,
        ownership_proof_response: otp,
      };

      const { err, res } = await createEntity(entityData);
      if (err) {
        setOtpAlert({
          severity: "error",
          message: err,
        });
        return;
      }

      if (res.long_lived_token) {
        setOtpAlert({
          severity: "success",
          message: res.message,
        });
        setOtpDialogOpen(false);
        await window.api.invoke("reload-window");
      }
    } catch (error) {
      setOtpAlert({
        severity: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  return (
    <Grid container height="100vh" justifyContent="center" alignItems="center">
      <Grid
        size={8}
        display="flex"
        height="100%"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        textAlign="center"
        sx={{
          py: 5,
          px: { xs: 5, md: 18 },
          overflowY: "auto",
        }}
      >
        <Typography variant="h3" sx={{ fontWeight: 600, mb: 8 }}>
          Sign Up
        </Typography>
        <Typography variant="h6" sx={{ py: 5 }}>
          Have an account?{" "}
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: "background.more",
              textDecoration: "none",
              fontWeight: "bold",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Login
          </Link>
        </Typography>

        <Snackbar
          open={alert.open}
          autoHideDuration={4000}
          onClose={() => setAlert({ ...alert, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert
            severity={alert.type}
            sx={{ width: "100%", maxWidth: 600, margin: "0 auto" }}
          >
            {alert.message}
          </MuiAlert>
        </Snackbar>

        <MuiTelInput
          fullWidth
          variant="standard"
          value={phone}
          onChange={handlePhoneChange}
          defaultCountry="CM"
          forceCallingCode
          focusOnSelectCountry
          required
          error={phoneError}
          helperText={phoneError ? phoneErrorMessage : ""}
          disabled={loading}
          sx={{
            py: 2,
            "& .MuiInput-root": {
              borderRadius: 4,
              backgroundColor: "background.default",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            },
          }}
        />

        <TextField
          fullWidth
          label="Password"
          variant="standard"
          name="password"
          value={passwordData.password}
          onChange={handlePasswordFieldChange}
          type={showPassword.password ? "text" : "password"}
          required
          error={passwordData.passwordError}
          helperText={passwordData.passwordError ? "Password is required" : ""}
          sx={{ mt: 8 }}
          disabled={loading}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility("password")}
                  edge="end"
                >
                  {showPassword.password ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          variant="standard"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordFieldChange}
          type={showPassword.confirmPassword ? "text" : "password"}
          required
          error={passwordData.confirmPasswordError}
          helperText={
            passwordData.confirmPasswordError ? "Passwords must match." : ""
          }
          sx={{ mt: 8 }}
          disabled={loading}
          slotProps={{
            input: {
              endAdornment: (
                <IconButton
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  edge="end"
                >
                  {showPassword.confirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              ),
            },
          }}
        />

        <Box display="flex" alignItems="center" sx={{ mt: 4 }}>
          <Checkbox
            checked={agreedToTerms}
            onChange={handleTermsChange}
            color="primary"
            disabled={loading}
          />
          <Typography variant="body2">
            I agree to the{" "}
            <Link
              to="/terms"
              component={RouterLink}
              sx={{
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Terms and Conditions
            </Link>
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 5,
            borderRadius: 7,
            width: "50%",
            bgcolor: "background.more",
            color: "primary.main",
            "&:hover": {
              bgcolor: "primary.main",
              color: "black",
            },
          }}
          onClick={handleSubmit}
          disabled={!agreedToTerms || loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        <Button
          variant="outlined"
          size="small"
          sx={{ mt: 2, borderRadius: 7, color: "primary", width: "40%" }}
          disabled={!agreedToTerms || loading}
          onClick={async () => {
            setPhoneError(false);

            await checkModems();

            const isPhoneValid = validatePhoneNumber();
            const isPasswordValid = validatePassword();

            if (!isPhoneValid || !isPasswordValid || !agreedToTerms) {
              if (!isPhoneValid) setPhoneError(true);
              return;
            }

            setLoading(true);
            setOtpDialogOpen(true);
          }}
        >
          Already have an OTP? Click here.
        </Button>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mt: 10 }}>
            <Link component={RouterLink} to="/bridge-auth" underline="always">
              Authenticate Offline
            </Link>
          </Typography>
        </Box>
      </Grid>
      <Grid
        size={4}
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          bgcolor: "background.paper",
          p: 2,
          overflowY: "auto",
        }}
      >
        <img
          src="login.png"
          alt="login illustration"
          style={{ width: "100%", height: "auto" }}
        />
      </Grid>

      <OTPDialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        onResend={handleSubmit}
        counterTimestamp={otpSettings.nextAttemptTimestamp}
        event={{
          ...(modemsAvailable && {
            callback: async () => {
              const phoneNumbers = ["AUTHMSG"];
              const messagePatterns = [
                /smswithoutborders.*verification code is:\s*(\d+)/i,
              ];

              const { err, message } = await fetchLatestMessageWithOtp({
                phoneNumbers,
                messagePatterns,
              });

              if (err) {
                setAlert({
                  open: true,
                  type: "error",
                  message: err,
                });
                return;
              }
              return message?.otp;
            },
            interval: 10000,
          }),
        }}
      />
    </Grid>
  );
}

export default SignupPage;
