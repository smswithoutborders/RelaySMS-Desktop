import React, { useState, useEffect, useCallback } from "react";
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
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
} from "@mui/material";
import { MuiTelInput, matchIsValidTel } from "mui-tel-input";
import { Link as RouterLink } from "react-router-dom";
import { formatDistanceToNow } from "../lib/timeUtils";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { OTPDialog, CaptchaDialog } from "../Components";
import { SettingsController, createEntity } from "../controllers";
import { useTranslation } from "react-i18next";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";

function SignupPage() {
  const settingsController = new SettingsController();
  const { t } = useTranslation();

  const countries = getCountries().map((countryCode) => {
    const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
    return {
      code: countryCode,
      name: regionNames.of(countryCode),
      callingCode: getCountryCallingCode(countryCode),
    };
  }).sort((a, b) => a.name.localeCompare(b.name));

  const [authMethod, setAuthMethod] = useState("email");
  // CAPTCHA state - disabled for now, will be re-enabled when server is ready
  // eslint-disable-next-line no-unused-vars
  const [captchaDialogOpen, setCaptchaDialogOpen] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [captchaToken, setCaptchaToken] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [country, setCountry] = useState(null);
  const [countryError, setCountryError] = useState(false);
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

  const fetchOtpSettings = useCallback(async () => {
    try {
      const [nextAttemptTimestamp, phoneNumber] = await Promise.all([
        settingsController.getData("preferences.otp.nextAttemptTimestamp"),
        settingsController.getData("preferences.otp.phoneNumber"),
      ]);
      setOtpSettings({ nextAttemptTimestamp, phoneNumber });
    } catch (error) {
      // Error fetching OTP settings
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchOtpSettings();
  }, [fetchOtpSettings]);

  const handleAuthMethodChange = (event, newMethod) => {
    if (newMethod !== null) {
      setAuthMethod(newMethod);
      setPhoneError(false);
      setPhoneErrorMessage("");
      setEmailError(false);
      setEmailErrorMessage("");
      setCountryError(false);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
    setEmailErrorMessage("");
  };

  const handleCountryChange = (event, newValue) => {
    setCountry(newValue);
    setCountryError(false);
  };

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

  const validateEmail = () => {
    if (!email) {
      setEmailErrorMessage("Email is required");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailErrorMessage("Please enter a valid email address");
      return false;
    }

    if (!country) {
      setCountryError(true);
      return false;
    }

    return true;
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
    setEmailError(false);

    let isIdentifierValid = false;
    if (authMethod === "phone") {
      isIdentifierValid = validatePhoneNumber();
      if (!isIdentifierValid) setPhoneError(true);
    } else {
      isIdentifierValid = validateEmail();
      if (!isIdentifierValid) setEmailError(true);
    }

    const isPasswordValid = validatePassword();

    if (!isIdentifierValid || !isPasswordValid || !agreedToTerms) {
      return;
    }

    // CAPTCHA temporarily disabled
    // TODO: Re-enable when CAPTCHA server is ready
    // if (!captchaToken) {
    //   setCaptchaDialogOpen(true);
    //   return;
    // }

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
        phoneNumber === phone &&
        authMethod === "phone"
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

      const entityData =
        authMethod === "phone"
          ? {
              country_code: phoneInfo.countryCode,
              phone_number: phone,
              password: passwordData.password,
              // captcha_token: captchaToken, // Disabled for now
            }
          : {
              country_code: country.code,
              email_address: email,
              password: passwordData.password,
              // captcha_token: captchaToken, // Disabled for now
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
        message: `${t(
          "an unexpected error occurred. please try again later."
        )}`,
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

  const handleCaptchaVerified = (token) => {
    setCaptchaToken(token);
    setCaptchaDialogOpen(false);
    // Automatically submit after CAPTCHA verification
    setTimeout(() => {
      handleSubmit();
    }, 100);
  };

  const handleOtpSubmit = async (setOtpAlert, otp) => {
    try {
      const entityData =
        authMethod === "phone"
          ? {
              country_code: phoneInfo.countryCode,
              phone_number: phone,
              password: passwordData.password,
              ownership_proof_response: otp,
            }
          : {
              country_code: country.code,
              email_address: email,
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
        message: `${t(
          "an unexpected error occurred. please try again later."
        )}`,
      });
    }
  };

  return (
    <Grid
      container
      height="100vh"
      justifyContent="center"
      alignItems="center"
      px={6}
    >
      <Grid
        size={7}
        sx={{
          py: 5,
          px: { xs: 5, md: 18 },
        }}
      >
        <Typography
          className="header"
          variant="h4"
          sx={{ fontWeight: 600, mb: 3 }}
        >
          {t("ui.signup")}
        </Typography>
        <Typography variant="body2" sx={{ pb: 10 }}>
          {t("ui.have an account?")}{" "}
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
            {t("ui.login")}
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

        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          {t("ui.choose your signup method")}
        </Typography>

        <Box
          sx={{
            display: "flex",
            mb: 4,
          }}
        >
          <ToggleButtonGroup
            value={authMethod}
            exclusive
            onChange={handleAuthMethodChange}
            aria-label="authentication method"
            disabled={loading}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 30,
              p: 0.5,
              backgroundColor: "background.paper",
              "& .MuiToggleButton-root": {
                flex: 1,
                py: 1,
                px: 4,
                textTransform: "none",
                fontSize: "0.95rem",
                border: "none",
                borderRadius: 30,
                color: "text.secondary",
                "&.Mui-selected": {
                  backgroundColor: "background.more",
                  color: "background.other",
                  "&:hover": {
                    backgroundColor: "background.more",
                  },
                },
                "&:hover": {
                  backgroundColor: "action.hover",
                },
              },
            }}
          >
            <ToggleButton value="email" aria-label="email">
              {t("ui.email")}
            </ToggleButton>
            <ToggleButton value="phone" aria-label="phone">
              {t("ui.phone")}
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {authMethod === "phone" ? (
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
            sx={{ py: 2 }}
          />
        ) : (
          <Box sx={{ display: "flex", gap: 2, py: 2 }}>
            <Autocomplete
              options={countries}
              getOptionLabel={(option) => option.name}
              value={country}
              onChange={handleCountryChange}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                    {...optionProps}
                  >
                    <span
                      style={{ fontSize: "1.5em" }}
                      role="img"
                      aria-label={option.name}
                    >
                      {String.fromCodePoint(
                        ...option.code
                          .toUpperCase()
                          .split("")
                          .map((char) => 127397 + char.charCodeAt(0))
                      )}
                    </span>
                    {option.name}
                  </Box>
                );
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("ui.country")}
                  variant="standard"
                  required
                  error={countryError}
                  helperText={countryError ? t("ui.country is required") : ""}
                  disabled={loading}
                  slotProps={{
                    input: {
                      ...params.InputProps,
                      startAdornment: country ? (
                        <span
                          style={{ fontSize: "1.5em", marginRight: "8px" }}
                          role="img"
                          aria-label={country.name}
                        >
                          {String.fromCodePoint(
                            ...country.code
                              .toUpperCase()
                              .split("")
                              .map((char) => 127397 + char.charCodeAt(0))
                          )}
                        </span>
                      ) : null,
                    },
                  }}
                />
              )}
              sx={{ minWidth: 200 }}
            />
            <TextField
              fullWidth
              label={t("ui.email")}
              variant="standard"
              value={email}
              onChange={handleEmailChange}
              type="email"
              required
              error={emailError}
              helperText={emailError ? emailErrorMessage : ""}
              disabled={loading}
            />
          </Box>
        )}

        <TextField
          fullWidth
          label={t("ui.password")}
          variant="standard"
          name="password"
          value={passwordData.password}
          onChange={handlePasswordFieldChange}
          type={showPassword.password ? "text" : "password"}
          required
          error={passwordData.passwordError}
          helperText={
            passwordData.passwordError ? `${t("ui.password is required")}` : ""
          }
          sx={{ mt: 5 }}
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
          label={t("ui.confirm password")}
          variant="standard"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handlePasswordFieldChange}
          type={showPassword.confirmPassword ? "text" : "password"}
          required
          error={passwordData.confirmPasswordError}
          helperText={
            passwordData.confirmPasswordError
              ? `${t("ui.passwords must match.")}`
              : ""
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
            {t("ui.i agree to the")}{" "}
            <Link
              to="/terms"
              component={RouterLink}
              sx={{
                textDecoration: "none",
                fontWeight: "bold",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              {t("ui.terms and conditions")}
            </Link>
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          sx={{
            mt: 10,
            textTransform: "none",
            fontWeight: "bold",
            borderRadius: 7,
            width: "50%",
            bgcolor: "background.more",
            color: "background.other",
            "&:hover": {
              bgcolor: "background.other",
              color: "background.more",
            },
          }}
          onClick={handleSubmit}
          disabled={!agreedToTerms || loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            `${t("signup")}`
          )}
        </Button>
      </Grid>
      <Grid
        size={5}
        height="100%"
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          p: 2,
        }}
      >
        <img
          src="images/relayics.svg"
          alt="login illustration"
          style={{ width: "90%", height: "auto" }}
        />
      </Grid>

      <OTPDialog
        open={otpDialogOpen}
        onClose={() => setOtpDialogOpen(false)}
        onSubmit={handleOtpSubmit}
        onResend={handleSubmit}
        counterTimestamp={otpSettings.nextAttemptTimestamp}
      />

      <CaptchaDialog
        open={captchaDialogOpen}
        onClose={() => setCaptchaDialogOpen(false)}
        onVerified={handleCaptchaVerified}
      />
    </Grid>
  );
}

export default SignupPage;
