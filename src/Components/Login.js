import React, { useState } from "react";
import { TextField, Button, Box, Dialog, Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";

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

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log("Login data:", loginData);
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
            onChange={(value) =>
              setLoginData((prevData) => ({ ...prevData, phoneNumber: value }))
            }
            style={{ marginBottom: "35px" }}
            inputComponent={TextField}
            InputProps={{
              label: "Phone Number",
              name: "phoneNumber",
              variant: "outlined",
              fullWidth: true,
            }}
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
