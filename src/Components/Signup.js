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
import OTPDialog from "../Components/OTP";
import { parsePhoneNumber } from "react-phone-number-input";

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
  const [responseMessage, setResponseMessage] = useState("");
  const [otpOpen, setOtpOpen] = useState(false);
  const [countryCode, setCountryCode] = useState("");
  const [serverResponse, setServerResponse] = useState({
    server_publish_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
    server_device_id_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
    long_lived_token: "",
  });

  const handleClose = () => {
    onClose();
    setSignupData({
      phoneNumber: "",
      password: "",
      repeatPassword: "",
      acceptPolicy: false,
    });
    setSignupErrors({});
    setResponseMessage("");
    setOtpOpen(false);
    setServerResponse({
      server_publish_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
      server_device_id_pub_key: "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
      long_lived_token: "",
    });
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
      alert(Object.values(errors).join(" "));
      return;
    }

    setLoading(true);
    try {
      const parsedPhoneNumber = parsePhoneNumber(signupData.phoneNumber);
      if (parsedPhoneNumber) {
        setCountryCode(parsedPhoneNumber.countryCallingCode);
      } else {
        alert("Invalid phone number");
        setLoading(false);
        return;
      }

      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        parsedPhoneNumber.countryCallingCode
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
      console.error("Error:", error);
      alert("Failed to create entity. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (otp) => {
    setLoading(true);
    try {
      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        countryCode,
        //serverResponse.server_publish_pub_key,
        //serverResponse.server_device_id_pub_key,
        "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
        "goKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoI=",
        otp
      );
      console.log("OTP Verification Response:", response);
      alert("Signup successful");
      setResponseMessage(`OTP Verified: ${response.message}`);
      // await window.api.storeParams("serverResponse", response);
      handleClose();
    } catch (error) {
      console.error("OTP Verification Error:", error);
      alert("Something went wrong, please check your OTP code and try again.");
      setResponseMessage(`OTP Verification Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      // Implement your resend OTP logic here
      const response = await window.api.createEntity(
        signupData.phoneNumber,
        signupData.password,
        countryCode
      );
      console.log("Resend OTP Response:", response);
      alert("OTP Resent: " + response.message);
    } catch (error) {
      console.error("Resend OTP Error:", error);
      alert("Something went wrong, please try again.");
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
          {/* {signupErrors.form && (
            <Typography color="error" variant="body2">
              {signupErrors.form}
            </Typography>
          )}
          {responseMessage && (
            <Typography variant="body2">{responseMessage}</Typography>
          )} */}
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
  );
}

export default Signup;
