import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
} from "@mui/material";

function OTPDialog({ open, onClose, onSubmit, onResend, counterTimestamp }) {
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (open) {
      const now = Math.floor(Date.now() / 1000);
      const remainingTime = counterTimestamp - now;
      setCounter(remainingTime > 0 ? remainingTime : 0);
    }
  }, [open, counterTimestamp]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleOtpChange = (event, index) => {
    const value = event.target.value;
    if (/^[0-9]?$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    onSubmit(otp.join(""));
  };

  const handleResend = () => {
    onResend();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        const prevInput = document.getElementById(`otp-${index - 1}`);
        if (prevInput) prevInput.focus();
      }
    }
  };

  useEffect(() => {
    if (open) {
      const firstInput = document.getElementById("otp-0");
      if (firstInput) firstInput.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Verify Your Identity
        </Typography>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Please enter the One-Time Password (OTP) sent to your registered
          mobile number.
        </Typography>
        <Box mt={2} mb={2}>
          <Grid container spacing={1}>
            {otp.map((digit, index) => (
              <Grid item xs={2} key={index}>
                <TextField
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  inputProps={{
                    maxLength: 1,
                    style: { textAlign: "center" },
                  }}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box mt={2}>
          {counter > 0 ? (
            <>
              <Typography variant="body2" color="textSecondary">
                Resend OTP in {counter} seconds
              </Typography>
              <Typography variant="body2" color="textSecondary">
                If you didn't receive the OTP, you can request a new one after
                the timer ends. Make sure your phone number is correct and has
                network coverage.
              </Typography>
            </>
          ) : (
            <Button
              onClick={handleResend}
              color="primary"
              fullWidth
              variant="outlined"
            >
              Resend OTP
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions style={{ padding: "16px" }}>
        <Button
          onClick={onClose}
          color="secondary"
          variant="outlined"
          style={{ marginRight: "8px" }}
        >
          Cancel
        </Button>
        <Button onClick={handleOtpSubmit} color="primary" variant="contained">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OTPDialog;
