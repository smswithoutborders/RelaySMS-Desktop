import React, { useState } from "react";
import {
  Dialog,
  Typography,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import { createEntity, completeEntity } from "../grpcClient";

function Signup({ onClose, open }) {
  const { t } = useTranslation();
  const [signupData, setSignupData] = useState({
    phoneNumber: "",
    password: "",
    repeatPassword: "",
    acceptPolicy: false,
  });
  const [signupErrors, setSignupErrors] = useState({});

  const handleClose = () => onClose();

  const handleSignupChange = (event) => {
    const { name, value, checked } = event.target;
    setSignupData((prevData) => ({
      ...prevData,
      [name]: name === "acceptPolicy" ? checked : value,
    }));
  };

  const handleSignupSubmit = (event) => {
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

    if (Object.keys(errors).length === 0) {
      createEntity(signupData.phoneNumber, (err, response) => {
        if (err) {
          console.error("Error:", err);
          setSignupErrors({
            form: "Failed to create entity. Please try again.",
          });
          return;
        }

        if (response.getRequiresOwnershipProof()) {
          const ownershipProofResponse = prompt(
            "Enter the OTP sent to your phone:"
          );
          if (ownershipProofResponse) {
            const completeRequest = {
              phoneNumber: signupData.phoneNumber,
              countryCode: "CM",
              password: signupData.password,
              ownershipProofResponse: ownershipProofResponse,
              clientPublishPubKey: "x25519 client publish public key",
              clientDeviceIdPubKey: "x25519 client device_id public key",
            };

            completeEntity(completeRequest, (err, response) => {
              if (err) {
                console.error("Error:", err);
                setSignupErrors({
                  form: "Failed to complete entity. Please try again.",
                });
                return;
              }

              console.log("Signup successful:", response);
            });
          }
        } else {
          console.log("Signup successful:", response);
        }
      });
    } else {
      setSignupErrors(errors);
    }
  };

  return (
    <Dialog sx={{ p: 4 }} onClose={handleClose} open={open}>
      <Typography align="center" variant="h6" sx={{ pt: 3 }}>
        {t("signUp")}
      </Typography>
      <form onSubmit={handleSignupSubmit}>
        <Box sx={{ m: 4 }}>
          <PhoneInput
            flags={flags}
            placeholder={t("enterPhoneNumber")}
            defaultCountry="CM"
            value={signupData.phoneNumber}
            onChange={(value) =>
              setSignupData((prevData) => ({ ...prevData, phoneNumber: value }))
            }
            error={!!signupErrors.phoneNumber}
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
          >
            {t("signUp")}
          </Button>
        </Box>
      </form>
    </Dialog>
  );
}

export default Signup;
