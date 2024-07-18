import React, { useState} from "react";
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
import "react-phone-number-input/style.css";
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
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    phoneNumber: "",
    password: "",
  });
  const [otpOpen, setOtpOpen] = useState(false);
  const [alert, setAlert] = useState({ message: "", severity: "" });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleClose = () => {
    onClose();
    setLoginData({ phoneNumber: "", password: "" });
    setOtpOpen(false);
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

    await window.api.storeParams(
      "client_device_id_key_pair",
      clientDeviceIdKeyPair
    );
    await window.api.storeParams(
      "client_publish_key_pair",
      clientPublishKeyPair
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
        setOtpOpen(true);     
        setAlert({
          message: "Login successful. OTP sent successfully. Check your phone for the code.",
          severity: "success",
          open: true,
        });
    } catch (error) {
      console.error("Login Error:", error);
      setAlert({
        message:
          error.message,
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      const clientDeviceIdKeyPair = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );
      const clientPublishKeyPair = await window.api.retrieveParams(
        "client_publish_key_pair"
      );

      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey,
        otp
      );
      console.log("OTP Verification Response:", response);

      await window.api.storeParams('serverDeviceId', response.server_device_id_pub_key);
      await window.api.storeParams('longLivedToken', response.long_lived_token);
      await window.api.storeSession(response, clientDeviceIdKeyPair);

      setAlert({
        message: "Login successful",
        severity: "success",
        open: true,
      });
      setTimeout(() => {
        navigate("/onboarding3"); 
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setAlert({
        message:
          error.message,
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
      const clientDeviceIdKeyPair = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );
      const clientPublishKeyPair = await window.api.retrieveParams(
        "client_publish_key_pair"
      );

      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey,
      );
      console.log("OTP Verification Response:", response);

      await window.api.storeParams('serverDeviceId', response.server_device_id_pub_key);
      await window.api.storeParams('longLivedToken', response.long_lived_token);
      await window.api.storeSession(response,clientDeviceIdKeyPair);

      setAlert({
        message: "Login successful",
        severity: "success",
        open: true,
      });
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setAlert({
        message:
          error.message,
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
        <Typography align="center" variant="h6" sx={{ pt: 4 }}>
          {t("login")}
        </Typography>
        {alert.message && (
          <Alert severity={alert.severity} sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}
        <form onSubmit={handleLoginSubmit}>
          <Box sx={{ m: 6, mx:8}}>
            <MuiTelInput
              fullWidth
              variant="standard"
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
              type={showPassword ? 'text' : 'password'} 
              variant="standard"
              value={loginData.password}
              onChange={handleLoginChange}
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
            />

            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              type="submit"
              sx={{ borderRadius: 5, px: 3, textTransform: "none" }}
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
