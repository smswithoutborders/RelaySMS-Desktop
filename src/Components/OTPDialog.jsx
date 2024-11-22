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
  Alert,
  CircularProgress,
} from "@mui/material";

function OTPDialog({
  open,
  onClose,
  onSubmit,
  onResend,
  counterTimestamp,
  alert,
  loading,
  type = "number", 
  otpLength = 6, 
  subText,
  rows,
  multiline,
  fullWidth
}) {
  const [otp, setOtp] = useState(type === "number" ? Array(otpLength).fill("") : "");

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
      if (type === "number") {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < otpLength - 1) {
          document.getElementById(`otp-${index + 1}`)?.focus();
        }
      } else {
        setOtp(value);
      }
    }
    if (alert?.onClose) alert.onClose();
  };

  const handleKeyDown = (event, index) => {
    if (type === "number" && event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = type === "number" ? otp.join("") : otp;
    if (otpValue.length === otpLength) {
      onSubmit(otpValue);
      setOtp(type === "number" ? Array(otpLength).fill("") : "");
    }
  };

  const handleResend = () => {
    setCounter(30);
    onResend();
  };

  useEffect(() => {
    if (open && type === "number") {
      document.getElementById("otp-0")?.focus();
    }
  }, [open, type]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="otp-dialog-title">
      <DialogContent sx={{ px: 5, pt: 5 }}>
        <Typography
          id="otp-dialog-title"
          variant="h6"
          gutterBottom
          textAlign="center"
        >
          Verify Your Identity
        </Typography>

        <Typography
          id="otp-dialog-title"
          variant="body2"
          gutterBottom
          textAlign="center"
          mt={2}
        >
         {subText}
        </Typography>

        {alert?.message && (
          <Box mt={2}>
            <Alert
              severity={alert.type || "info"}
              onClose={alert.onClose || undefined}
            >
              {alert.message}
            </Alert>
          </Box>
        )}

        <Box mt={2}>
          {type === "number" ? (
            <Grid container spacing={1}>
              {otp.map((digit, index) => (
                <Grid item xs={12 / otpLength} key={index}>
                  <TextField
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    slotProps={{
                      input: {
                        maxLength: 1,
                        style: { textAlign: "center" },
                        "aria-label": `OTP digit ${index + 1}`,
                      },
                    }}
                    variant="outlined"
                    autoComplete="off"
                    disabled={loading}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <TextField
              fullWidth={fullWidth}
              value={otp}
              onChange={(e) => handleOtpChange(e)}
              placeholder={`Enter OTP`}
              inputProps={{
                maxLength: otpLength,
                style: { textAlign: "center" },
              }}
              variant="outlined"
              autoComplete="off"
              disabled={loading}
              rows={rows}
              multiline={multiline}
            />
          )}
        </Box>

        <Box mt={2} textAlign="center">
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Didn't receive the OTP?
          </Typography>
          {counter > 0 ? (
            <Typography variant="body2" color="textSecondary">
              Resend OTP in {counter} seconds
            </Typography>
          ) : (
            <Button
              onClick={handleResend}
              color="primary"
              variant="contained"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Resend OTP"
              )}
            </Button>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 5, pb: 5 }}>
        <Button
          onClick={onClose}
          color="error"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOtpSubmit}
          color="primary"
          variant="contained"
          fullWidth
          disabled={
            (type === "number" ? otp.join("").length < otpLength : otp.length < otpLength) ||
            loading
          }
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OTPDialog;
