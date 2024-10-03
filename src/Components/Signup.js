import React, { useState } from "react";
import {
  Dialog,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Snackbar,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import "react-phone-number-input/style.css";
import { useTranslation } from "react-i18next";
import OTPDialog from "../Components/OTP";
import { parsePhoneNumber } from "react-phone-number-input";
import { MuiTelInput } from "mui-tel-input";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

function Signup({ onClose, open, anchorEl, asDialog }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [signupData, setSignupData] = useState({
    phoneNumber: "",
    password: "",
    repeatPassword: "",
    acceptPolicy: false,
  });
  const [signupErrors, setSignupErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    onClose();
    setSignupData({
      phoneNumber: "",
      password: "",
      repeatPassword: "",
      acceptPolicy: false,
    });
    setSignupErrors({});
    setOtpOpen(false);
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSignupChange = (event) => {
    const { name, value, checked } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: name === "acceptPolicy" ? checked : value,
    }));
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (!signupData.phoneNumber)
      errors.phoneNumber = "Phone number is required";
    if (!signupData.password) errors.password = "Password is required";
    if (!signupData.repeatPassword)
      errors.repeatPassword = "Please repeat your password";
    if (signupData.password !== signupData.repeatPassword)
      errors.repeatPassword = "Passwords do not match";
    if (!signupData.acceptPolicy)
      errors.acceptPolicy = "Please accept the privacy policy";

    if (Object.keys(errors).length > 0) {
      setAlert({
        message: Object.values(errors).join(" "),
        severity: "error",
        open: true,
      });
      return;
    }

    setLoading(true);
    try {
      const parsedPhoneNumber = parsePhoneNumber(signupData.phoneNumber);
      if (!parsedPhoneNumber) {
        setAlert({
          message: "Invalid phone number",
          severity: "error",
          open: true,
        });
        setLoading(false);
        return;
      }

      setCountryCode(parsedPhoneNumber.country);

      // Generate Curve25519 key pairs
      const clientPublishKeyPair = generateKeyPair();
      const clientDeviceIdKeyPair = generateKeyPair();

      await Promise.all([
        window.api.storeParams(
          "client_device_id_key_pair",
          clientDeviceIdKeyPair
        ),
        window.api.storeParams("client_publish_key_pair", clientPublishKeyPair),
      ]);

      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        parsedPhoneNumber.country,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey
      );
      console.log("Response:", response);
      await Promise.all([
        window.api.storeParams("phone_number", signupData.phoneNumber),
      ]);
      setAlert({ message: response.message, severity: "success", open: true });
      setOtpOpen(true);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage =
        error?.message || "Failed to create entity. Please try again.";
      setAlert({ message: errorMessage, severity: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      const [clientDeviceIdKeyPair, clientPublishKeyPair] = await Promise.all([
        window.api.retrieveParams("client_device_id_key_pair"),
        window.api.retrieveParams("client_publish_key_pair"),
      ]);

      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        countryCode,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey,
        otp
      );
      console.log("OTP Verification Response:", response);
      await window.api.storeParams(
        "serverDeviceId",
        response.server_device_id_pub_key
      );
      await window.api.storeParams("longLivedToken", response.long_lived_token);
      await window.api.storeParams(
        "serverPublishPubKey",
        response.server_publish_pub_key
      );
      await Promise.all([
        window.api.storeParams(
          "serverDeviceId",
          response.server_device_id_pub_key
        ),
        window.api.storeParams("longLivedToken", response.long_lived_token),
        window.api.storeParams(
          "serverPublishPubKey",
          response.server_publish_pub_key
        ),
        window.api.storeParams("phone_number", signupData.phoneNumber),
      ]);

      setAlert({
        message: "Signup successful",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        navigate("/messages");
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Retrieve the previously stored keys
      const clientDeviceIdPubKey = await window.api.retrieveParams(
        "client_device_id_pub_key"
      );
      const clientPublishPubKey = await window.api.retrieveParams(
        "client_publish_pub_key"
      );

      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        countryCode,
        clientDeviceIdPubKey,
        clientPublishPubKey
      );
      console.log("Resend OTP Response:", response);
      await window.api.storeParams(
        "serverDeviceId",
        response.server_device_id_pub_key
      );
      await window.api.storeParams("longLivedToken", response.long_lived_token);

      setAlert({
        message: "OTP Resent: " + response.message,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const content = ( 
   <>
        <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Box sx={{ p: 4 }}>
        <Typography align="center" variant="h6" sx={{ pt: 3 }}>
          {t("signUp")}
        </Typography>
        <form onSubmit={handleSignupSubmit}>
          <Box sx={{ m: 6, mx: 8 }}>
            <MuiTelInput
              fullWidth
              sx={{ mb: 4 }}
              variant="standard"
              international="true"
              defaultCountry="CM"
              value={signupData.phoneNumber}
              onChange={(value) =>
                setSignupData((prevData) => ({
                  ...prevData,
                  phoneNumber: value.replace(/\s+/g, ""),
                }))
              }
            />
            <TextField
              fullWidth
              label={t("password")}
              name="password"
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={signupData.password}
              onChange={handleSignupChange}
              sx={{ mb: 4 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!signupErrors.password}
            />
            <TextField
              fullWidth
              label={t("repeatPassword")}
              name="repeatPassword"
              type={showPassword ? "text" : "password"}
              variant="standard"
              value={signupData.repeatPassword}
              onChange={handleSignupChange}
              sx={{ mb: 2 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!signupErrors.repeatPassword}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptPolicy"
                  checked={signupData.acceptPolicy}
                  onChange={handleSignupChange}
                />
              }
              label={t("acceptPrivacyPolicy")}
              sx={{ mb: 2 }}
            />
            <Button
              sx={{ borderRadius: 5, px: 3, textTransform: "none", mt: 11 }}
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? "Loading..." : t("signUp")}
            </Button>
          </Box>
        </form>
        <OTPDialog
          open={otpOpen}
          onClose={() => setOtpOpen(false)}
          onSubmit={handleOtpSubmit}
          onResend={handleResendOtp}
        />
      </Box>
   </>

    );

    return asDialog ? (
      <Dialog open={open} anchorEl={anchorEl} onClose={onClose}>
        {content}
      </Dialog>
    ) : (
      <Box>{content}</Box>
    );
}

export default Signup;
