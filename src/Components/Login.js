import React, { useState } from "react";
import { TextField, Button, Box, Dialog, Typography } from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { useTranslation } from "react-i18next";
import OTPDialog from "../Components/OTP";

function Login({ onClose, open }) {
  const { t } = useTranslation();
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
      setResponseMessage(Object.values(errors).join(" "));
      return;
    }

    setLoading(true);
    try {
      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password
      );
      console.log("Response:", response);
      setResponseMessage(response.message);
      if (response.requires_ownership_proof) {
        setServerResponse({
          server_publish_pub_key: response.server_publish_pub_key,
          server_device_id_pub_key: response.server_device_id_pub_key,
          long_lived_token: response.long_lived_token,
        });
        setOtpOpen(true);
      } else {
        alert("OTP sent successfully. Check your phone for the code.");
        handleClose();
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert(
        "Something went wrong, please check your phone number and password"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      const response = await window.api.authenticateEntity(
        loginData.phoneNumber,
        loginData.password,
        "11vOfAuKl3Fxdo4ZUnx2RMcmpzGighUmiBWWZsQkYkE=",
        "5wg5+6uv17po5B5S/i41QunMD1W8ZOHzKAAVO6moA28=",
        otp
      );
      console.log("OTP Verification Response:", response);
      alert("Login successful");
      //await window.api.storeParams("serverResponse", response);
      handleClose();
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Something went wrong, please check your OTP code and try again.");
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
      alert("OTP Resent: " + response.message);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      alert("Something went wrong, please try again");
    } finally {
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const fetchParams = async () => {
  //     try {
  //       const storedParams = await window.api.retrieveParams("serverResponse");
  //       console.log("Stored Params:", storedParams);
  //     } catch (error) {
  //       console.error("Retrieval Error:", error);
  //     }
  //   };
  //   fetchParams();
  // }, []);

  return (
    <Dialog sx={{ p: 4 }} onClose={handleClose} open={open}>
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
          {/* {responseMessage && (
            <Typography color="error" variant="body2">
              {responseMessage}
            </Typography>
          )} */}
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
  );
}

export default Login;
