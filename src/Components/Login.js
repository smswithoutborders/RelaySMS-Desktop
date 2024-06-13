import React, { useState } from "react";
import { TextField, Button, Box, Dialog, Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import { authenticateEntity, completeAuthentication } from "../grpcClient";

function Login({ onClose, open }) {
  const { t } = useTranslation();
  const [loginData, setLoginData] = useState({ phoneNumber: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleClose = () => {
    onClose();
    setLoginData({ phoneNumber: "", password: "" });
    setError(null);
    console.log("Dialog closed, state reset.");
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    console.log(`Login data changed: ${name} = ${value}`);
  };

  const handlePhoneNumberChange = (value) => {
    setLoginData((prevData) => ({
      ...prevData,
      phoneNumber: value || "",
    }));
    console.log(`Phone number changed: ${value}`);
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    console.log("Login submission started:", loginData);

    authenticateEntity(
      loginData.phoneNumber,
      loginData.password,
      (err, response) => {
        if (err) {
          console.error("Authentication error:", err);
          setError("Authentication failed. Please try again.");
          setLoading(false);
          return;
        }

        console.log("Authentication response:", response);

        if (response.requiresOwnershipProof) {
          console.log("Ownership proof required.");
          const ownershipProofResponse = prompt(
            "Enter the OTP sent to your phone:"
          );

          const completeRequest = {
            phoneNumber: loginData.phoneNumber,
            ownershipProofResponse,
            clientPublishPubKey: "x25519 client publish public key",
            clientDeviceIdPubKey: "x25519 client device_id public key",
          };

          console.log("Complete authentication request:", completeRequest);

          completeAuthentication(completeRequest, (err, response) => {
            setLoading(false);

            if (err) {
              console.error("OTP verification error:", err);
              setError("OTP verification failed. Please try again.");
              return;
            }

            console.log("OTP verification successful:", response);
            handleClose(); // Close dialog on successful login
          });
        } else {
          console.log("No ownership proof required. Login failed.");
          setLoading(false);
          setError("Login failed. No ownership proof required.");
        }
      }
    );
  };

  return (
    <Dialog sx={{ p: 10 }} onClose={handleClose} open={open}>
      <form onSubmit={handleLoginSubmit}>
        <Box sx={{ m: 4 }}>
          <PhoneInput
            flags={flags}
            placeholder={t("enterPhoneNumber")}
            defaultCountry="CM"
            value={loginData.phoneNumber}
            onChange={handlePhoneNumberChange}
            label="Phone number"
            title="International phone number"
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
          />
          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "loading" : t("login")}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default Login;
