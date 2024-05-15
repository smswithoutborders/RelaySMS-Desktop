import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Container,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
} from "@mui/material";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import flags from "react-phone-number-input/flags";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";

function LoginSignupPage() {
  const [tabIndex, setTabIndex] = useState(0);
  const [loginData, setLoginData] = useState({ phoneNumber: "", password: "" });
  const [signupData, setSignupData] = useState({
    phoneNumber: "",
    password: "",
    repeatPassword: "",
    acceptPolicy: false,
  });
  const [signupErrors, setSignupErrors] = useState({});

  const handleChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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
    if (!signupData.phoneNumber) {
      errors.phoneNumber = "Phone number is required";
    }
    if (!signupData.password) {
      errors.password = "Password is required";
    }
    if (!signupData.repeatPassword) {
      errors.repeatPassword = "Please repeat your password";
    } else if (signupData.password !== signupData.repeatPassword) {
      errors.repeatPassword = "Passwords do not match";
    }
    if (!signupData.acceptPolicy) {
      errors.acceptPolicy = "Please accept the privacy policy";
    }
    if (Object.keys(errors).length === 0) {
      console.log("Signup data:", signupData);
    } else {
      setSignupErrors(errors);
    }
  };

  const handleLoginSubmit = (event) => {
    event.preventDefault();
    console.log("Login data:", loginData);
  };

  return (
    <Container maxWidth="md" sx={{ p: 4 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/messages">
          <FaArrowLeft size="20px" />
        </IconButton>
      </Box>
      <Tabs value={tabIndex} onChange={handleChange} centered>
        <Tab label="Login" />
        <Tab label="Sign Up" />
      </Tabs>
      {tabIndex === 0 && (
        <form onSubmit={handleLoginSubmit}>
          <Box sx={{ m: 4 }}>
            <PhoneInput
              flags={flags}
              placeholder="Enter phone number"
              defaultCountry="CM"
              value={loginData.phoneNumber}
              onChange={(value) =>
                setLoginData((prevData) => ({
                  ...prevData,
                  phoneNumber: value,
                }))
              }
              style={{ marginBottom: "35px" }}
              inputComponent={TextField}
              InputProps={{
                label: "Phone Number",
                name: "phoneNumber",
                variant: "outlined",
                fullWidth: true,
                error: !!signupErrors.phoneNumber,
                // helperText: signupErrors.phoneNumber,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={loginData.password}
              onChange={handleLoginChange}
              sx={{ mb: 4 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Box>
        </form>
      )}
      {tabIndex === 1 && (
        <form onSubmit={handleSignupSubmit}>
          <Box sx={{ m: 4 }}>
            <PhoneInput
              flags={flags}
              placeholder="Enter phone number"
              defaultCountry="CM"
              value={signupData.phoneNumber}
              onChange={(value) => handleSignupChange("phoneNumber", value)}
              style={{ marginBottom: "35px" }}
              inputComponent={TextField}
              InputProps={{
                label: "Phone Number",
                name: "phoneNumber",
                variant: "outlined",
                fullWidth: true,
                error: !!signupErrors.phoneNumber,
                // helperText: signupErrors.phoneNumber,
              }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              variant="outlined"
              value={signupData.password}
              onChange={handleSignupChange}
              sx={{ mb: 4 }}
            />
            <TextField
              fullWidth
              label="Repeat Password"
              name="repeatPassword"
              type="password"
              variant="outlined"
              value={signupData.repeatPassword}
              onChange={handleSignupChange}
              sx={{ mb: 4 }}
            />
            <FormControlLabel
              control={
                <Checkbox
                  name="acceptPolicy"
                  checked={signupData.acceptPolicy}
                  onChange={handleSignupChange}
                />
              }
              label="Accept Privacy Policy"
            />
            <br />
            <Button
              sx={{ mt: 4 }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Sign Up
            </Button>
          </Box>
        </form>
      )}
    </Container>
  );
}

export default LoginSignupPage;
