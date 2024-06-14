import React, { useState } from "react";
import { TextField, Button, Box, Dialog, Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";

function Login({ onClose, open }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleClose = () => {
    onClose();
    setPhoneNumber("");
    setPassword("");
    setResponseMessage("");
    console.log("Dialog closed, state reset.");
  };

  const handleCreateEntity = async () => {
    setLoading(true);
    try {
      const response = await window.api.createEntity(phoneNumber, password);
      console.log("Response:", response);
      setResponseMessage(`Greeting: ${response.message}`);
    } catch (error) {
      console.error("Error:", error);
      setResponseMessage(`Error: ${error.message}`);
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
          onClick={handleCreateEntity}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? "Loading..." : t("login")}
        </Button>
      </Box>
    </Dialog>
  );
}

export default Login;
