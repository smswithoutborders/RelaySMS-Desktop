import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { OTPDialog } from "../Components";
import { SettingsController, createEntity } from "../controllers";

function SignupPage() {
  const navigate = useNavigate();
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
    event.preventDefault();

    setPhoneError(false);

    const isPhoneValid = validatePhoneNumber();
    const isPasswordValid = validatePassword();

    if (!isPhoneValid || !isPasswordValid || !agreedToTerms) {
      if (!isPhoneValid) setPhoneError(true);
      return;
    }

    const counterTimestamp = settingsController.getSetting(
      "preferences.otp.nextAttemptTimestamp"
    );
    const counterPhoneNumber = settingsController.getSetting(
      "preferences.otp.phoneNumber"
    );
    const now = Math.floor(Date.now() / 1000);
    if (
      counterTimestamp &&
      counterTimestamp > now &&
      counterPhoneNumber === phone
    ) {
      const timeLeft = formatDistanceToNow(counterTimestamp * 1000, {
        includeSeconds: true,
      });
      setAlert({
        open: true,
        type: "info",
        message: `You can request a new OTP in ${timeLeft}. Please wait before trying again.`,
      });
      setOtpDialogOpen(true);
      return;
    }

    const entityData = {
      country_code: phoneInfo.countryCode,
      phone_number: phone,
      password: passwordData.password,
    };

    try {
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
        setOtpDialogOpen(true);
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
        message: "An unexpected error occurred. Please try again later.",
      });
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleOtpSubmit = async (otp) => {
    const entityData = {
      country_code: phoneInfo.countryCode,
      phone_number: phone,
      password: passwordData.password,
      ownership_proof_response: otp,
    };

    try {
      const { err, res } = await createEntity(entityData);
      if (err) {
        setAlert({
          open: true,
          type: "error",
          message: err,
        });
        return;
      }

      if (res.long_lived_token) {
        setAlert({
          open: true,
          type: "success",
          message: res.message,
        });
        setOtpDialogOpen(false);
        setTimeout(() => {
          navigate("/#/", { replace: true });
        }, 1000);
      }
    } catch (error) {
      setAlert({
        open: true,
        type: "error",
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
            color: "white",
            "&:hover": {
              bgcolor: "primary.main",
              color: "black",
            },
          }}
          onClick={handleSubmit}
          disabled={!agreedToTerms}
        >
          Sign Up
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
          src="https://img.freepik.com/premium-vector/qr-code-isolated-white-background-universal-product-scan-code-doodle-style-vector-icon-design-element-hand-drawn_186802-2493.jpg?ga=GA1.2.2006603533.1697742214&semt=sph"
          alt="QR Code"
          style={{ width: "100%", height: "auto", maxWidth: "300px" }}
        />
      </Grid>

      <OTPDialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        onResend={() => {
          console.log("Resend OTP requested");
          setAlert({
            message: "A new OTP has been sent to your mobile number.",
            severity: "info",
          });
        }}
        counterTimestamp={settingsController.getSetting(
          "preferences.otp.nextAttemptTimestamp"
        )}
        alert={alert}
      />
    </Grid>
  );
}

export default SignupPage;