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
} from "@mui/material";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import OTPDialog from "../Components/OTP";
import { parsePhoneNumber } from "react-phone-number-input";
import { MuiTelInput } from "mui-tel-input";
import { useNavigate } from "react-router-dom";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";

function generateKeyPair() {
  const keyPair = nacl.box.keyPair();
  return {
    publicKey: naclUtil.encodeBase64(keyPair.publicKey),
    secretKey: naclUtil.encodeBase64(keyPair.secretKey),
  };
}

function Signup({ onClose, open }) {
  const { t } = useTranslation();
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
  const [serverResponse, setServerResponse] = useState({
    server_publish_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
    server_device_id_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
    long_lived_token: "",
  });
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
    setSignupData({
      phoneNumber: "",
      password: "",
      repeatPassword: "",
      acceptPolicy: false,
      countryCode: "CM",
    });
    setSignupErrors({});
    setOtpOpen(false);
    setServerResponse({
      server_publish_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
      server_device_id_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
      long_lived_token: "",
    });
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

    // Check password strength
    const passwordRegex =
      /^(?=.*[!@#$%^&*()_+\-=])[a-zA-Z0-9!@#$%^&*()_+\-=]{8,}$/;
    if (!passwordRegex.test(signupData.password)) {
      setAlert({
        message:
          "Password must be at least 8 characters long; Must include at least one special character from the following set: !@#$%^&*()_+-",
        severity: "error",
        open: true,
      });
      return;
    }

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

      // Store the generated keys for use in OTP verification
      await window.api.storeParams(
        "client_device_id_pub_key",
        clientDeviceIdKeyPair.publicKey
      );
      await window.api.storeParams(
        "client_publish_pub_key",
        clientPublishKeyPair.publicKey
      );

      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        parsedPhoneNumber.country,
        clientDeviceIdKeyPair.publicKey,
        clientPublishKeyPair.publicKey
      );
      console.log("Response:", response);

      if (response.error === "PASSWORD_BREACHED") {
        setAlert({
          message:
            "This password has been found in a data breach and should not be used. Please choose a different password.",
          severity: "error",
          open: true,
        });
        return;
      }

      setAlert({ message: response.message, severity: "success", open: true });
      if (response.requires_ownership_proof) {
        setServerResponse({
          server_publish_pub_key: response.server_publish_pub_key,
          server_device_id_pub_key: response.server_device_id_pub_key,
          long_lived_token: response.long_lived_token,
        });
        setOtpOpen(true);
      } else {
        setAlert({
          message:
            "Signup successful. OTP sent successfully. Check your phone for the code.",
          severity: "success",
          open: true,
        });
        setTimeout(() => {
          navigate("/onboarding3"); // Navigate to /onboarding3 after showing the success message
          handleClose();
        }, 2000);
      }
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
        clientPublishPubKey,
        otp
      );
      console.log("OTP Verification Response:", response);
      if (response.long_lived_token) {
        await window.api.storeParams("long_lived_token", response.long_lived_token);
      }
      setAlert({
        message: "Signup successful",
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
      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        countryCode
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
        message: "Something went wrong, please try again.",
        severity: "error",
        open: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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
          {t("signUp")}
        </Typography>
        <form onSubmit={handleSignupSubmit}>
          <Box sx={{ m: 4 }}>
            <MuiTelInput
              fullWidth
              sx={{ mb: 4 }}
              international="true"
              defaultCountry="CM"
              value={signupData.phoneNumber}
              onChange={(value) =>
                setSignupData((prevData) => ({
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
              value={signupData.password}
              onChange={handleSignupChange}
              sx={{ mb: 4 }}
              error={!!signupErrors.password}
            />
            <TextField
              fullWidth
              label={t("repeatPassword")}
              name="repeatPassword"
              type="password"
              variant="outlined"
              value={signupData.repeatPassword}
              onChange={handleSignupChange}
              sx={{ mb: 4 }}
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
              sx={{ mt: 4 }}
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
      </Dialog>
    </div>
  );
}

export default Signup;
