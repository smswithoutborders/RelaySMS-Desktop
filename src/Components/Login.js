import React, { useState } from "react";
import {
  TextField,
  Button,
  Box,
  Dialog,
  Typography,
  Input,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import OTPDialog from "../Components/OTP";

function Login({ onClose, open }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);

  const handleClose = () => {
    onClose();
    setPhoneNumber("");
    setPassword("");
    setResponseMessage("");
    setOtpOpen(false);
    console.log("Dialog closed, state reset.");
  };

  const handleAuthenticateEntity = async () => {
    setLoading(true);
    try {
      const response = await window.api.authenticateEntity(
        phoneNumber,
        password
      );
      console.log("Response:", response);
      setResponseMessage(response.message);
      if (response.requires_ownership_proof) {
        setOtpOpen(true); // Open the OTP dialog if required
      }
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      const response = await window.api.verifyOtp(phoneNumber, otp);
      console.log("OTP Verification Response:", response);
      setResponseMessage(`OTP Verified: ${response.message}`);
      handleClose(); // Close the dialog after successful OTP verification
    } catch (error) {
      console.error("OTP Verification Error:", error);
      setResponseMessage(`OTP Verification Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog sx={{ p: 10 }} onClose={handleClose} open={open}>
      <Box sx={{ m: 4 }}>
        <PhoneInput
          flags={flags}
          placeholder={t("enterPhoneNumber")}
          defaultCountry="CM"
          value={phoneNumber}
          onChange={setPhoneNumber}
          label="Phone number"
          title="International phone number"
          //inputComponent={TextField}
        />

        <TextField
          fullWidth
          label={t("password")}
          name="password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 4 }}
        />
        {responseMessage && (
          <Typography variant="body2">{responseMessage}</Typography>
        )}
        <Button
          onClick={handleAuthenticateEntity}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Loading..." : t("login")}
        </Button>
      </Box>
      <OTPDialog
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onSubmit={handleOtpSubmit}
      />
    </Dialog>
  );
}

export default Login;
