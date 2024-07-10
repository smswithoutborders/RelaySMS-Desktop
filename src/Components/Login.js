import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  Typography,
  Alert,
  Snackbar,
  InputAdornment,
  IconButton,
} from "@mui/material";
// import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import OTPDialog from "../Components/OTP";
import { MuiTelInput } from "mui-tel-input";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

function Login({ onClose, open }) {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [responseMessage, setResponseMessage] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [serverResponse, setServerResponse] = useState({
    server_publish_pub_key: "",
    server_device_id_pub_key: "",
    long_lived_token: "",
  });
  const [alert, setAlert] = useState({ message: "", severity: "" });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    onClose();
    setLoginData({ phoneNumber: "", password: "" });
    setResponseMessage("");
    setOtpOpen(false);
    setServerResponse({
      server_publish_pub_key: "",
      server_device_id_pub_key: "",
      long_lived_token: "",
    });
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };
  const navigate = useNavigate();

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!loginData.phoneNumber)
      errors.phoneNumber = t("Phone number is required");
    if (!loginData.password) errors.password = t("Password is required");

    if (Object.keys(errors).length > 0) {
      setAlert({ message: Object.values(errors).join(" "), severity: "error" });
      return;
    }

    setLoading(true);
    // Generate Curve25519 key pairs
    const clientPublishKeyPair = generateKeyPair();
    const clientDeviceIdKeyPair = generateKeyPair();

    // Store the generated keys for use in OTP verification
    await window.api.storeParams(
      "client_device_id_pub_key",
      clientDeviceIdKeyPair.publicKey
    );
    await window.api.storeParams(
      "client_publish_pub_key",
      clientPublishKeyPair.publicKey
    );

    try {
      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey
      );
      console.log("Response:", response);
      setAlert({ message: response.message, severity: "success", open: true });
      if (response.requires_ownership_proof) {
        setServerResponse({
          server_publish_pub_key: response.server_publish_pub_key,
          server_device_id_pub_key: response.server_device_id_pub_key,
          long_lived_token: response.long_lived_token,
        });
        setOtpOpen(true);
      } else {
        await window.api.storeParams(
          "longLivedToken",
          response.long_lived_token
        ); // Store the token here
        await window.api.storeSession(response);
        setAlert({
          message:
            "Login successful. OTP sent successfully. Check your phone for the code.",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          navigate("/onboarding3"); // Navigate to /onboarding3 after showing the success message
          handleClose();
        }, 2000);
      }
    } catch (error) {
      console.error("Login Error:", error);
      setAlert({
        message:
          "Something went wrong, please check your phone number and password",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      // Retrieve the previously stored keys
      const clientDeviceIdPubKey = await window.api.retrieveParams(
        "client_device_id_pub_key"
      );
      const clientPublishPubKey = await window.api.retrieveParams(
        "client_publish_pub_key"
      );

      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password,
        clientDeviceIdPubKey,
        clientPublishPubKey,
        otp
      );
      console.log("OTP Verification Response:", response);
      await window.api.storeParams("longLivedToken", response.long_lived_token); // Store the token here
      setAlert({
        message: "Login successful",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        navigate("/onboarding3"); // Navigate to /onboarding3 after showing the success message
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setAlert({
        message:
          "Something went wrong, please check your OTP code and try again.",
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
      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password
      );
      console.log("Resend OTP Response:", response);
      setAlert({
        message: "OTP Resent: " + response.message,
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.error("Resend OTP Error:", error);
      setAlert({
        message: "Something went wrong, please try again",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
      <Dialog sx={{ p: 4 }} onClose={handleClose} open={open}>
        <Typography align="center" variant="h6" sx={{ pt: 3 }}>
          {t("login")}
        </Typography>
        {alert.message && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <form onSubmit={handleLoginSubmit}>
          <Box sx={{ m: 4 }}>
            <MuiTelInput
              fullWidth
              flags={flags}
              placeholder={t("enterPhoneNumber")}
              defaultCountry="CM"
              value={loginData.phoneNumber}
              sx={{ mb: 4 }}
              onChange={(value) =>
                setLoginData((prevData) => ({
                  ...prevData,
                  phoneNumber: value,
                }))
              }
            />
            <TextField
              fullWidth
              label={t("password")}
              name="password"
              type="password"
              variant="outlined"
              value={loginData.password}
              onChange={handleLoginChange}
              sx={{ mb: 4 }}
              endadornment={
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
              }
            />

            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              type="submit"
            >
              {loading ? "Loading..." : t("login")}
            </Button>
          </Box>
        </form>
        <OTPDialog
          open={otpOpen}
          onClose={() => setOtpOpen(false)}
          onSubmit={handleOtpSubmit}
          onResend={handleResendOtp}
        />
      </Dialog>
    </>
  );
}

export default Login;
