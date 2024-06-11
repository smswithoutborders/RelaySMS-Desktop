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

  const handleClose = () => onClose();

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handlePhoneNumberChange = (value) => {
    setLoginData((prevData) => ({
      ...prevData,
      phoneNumber: value || "",
    }));
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();

    authenticateEntity(
      loginData.phoneNumber,
      loginData.password,
      (err, response) => {
        if (err) {
          console.error(err);
          return;
        }

        if (response.getRequiresOwnershipProof()) {
          const ownershipProofResponse = prompt(
            "Enter the OTP sent to your phone:"
          );

          const completeRequest = {
            phoneNumber: loginData.phoneNumber,
            ownershipProofResponse,
            clientPublishPubKey: "x25519 client publish public key",
            clientDeviceIdPubKey: "x25519 client device_id public key",
          };

          completeAuthentication(completeRequest, (err, response) => {
            if (err) {
              console.error(err);
              return;
            }

            console.log("Login successful:", response.toObject());
          });
        }
      }
    );
  };

  return (
    <Dialog sx={{ p: 10 }} onClose={handleClose} open={open}>
      <Typography align="center" variant="h6" sx={{ pt: 3 }}>
        {t("login")}
      </Typography>
      <form onSubmit={handleLoginSubmit}>
        <Box sx={{ m: 4 }}>
          <PhoneInput
            flags={flags}
            placeholder={t("enterPhoneNumber")}
            defaultCountry="CM"
            value={loginData.phoneNumber}
            onChange={handlePhoneNumberChange}
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
          <Button type="submit" variant="contained" color="primary">
            {t("login")}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default Login;
