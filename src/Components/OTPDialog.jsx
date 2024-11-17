import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid2 as Grid,
  Alert,
} from "@mui/material";

function OTPDialog({
  open,
  onClose,
  onSubmit,
  onResend,
  counterTimestamp,
  alert,
}) {
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
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
    if (alert?.onClose) alert.onClose();
  };

  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace" && otp[index] === "") {
      if (index > 0) {
        document.getElementById(`otp-${index - 1}`)?.focus();
      }
    }
  };

  const handleOtpSubmit = () => {
    const otpValue = otp.join("");
    if (otpValue.length === 6) {
      onSubmit(otpValue);
      setOtp(Array(6).fill(""));
    }
  };

  const handleResend = () => {
    setCounter(30);
    onResend();
  };

  useEffect(() => {
    if (open) {
      document.getElementById("otp-0")?.focus();
    }
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="otp-dialog-title">
      <DialogContent sx={{ px: 5, pt: 5 }}>
        <Typography
          id="otp-dialog-title"
          variant="h6"
          gutterBottom
          textAlign={"center"}
        >
          Verify Your Identity
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
          <Grid container spacing={1}>
            {otp.map((digit, index) => (
              <Grid size={2} key={index}>
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
                />
              </Grid>
            ))}
          </Grid>
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
            >
              Resend OTP
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
          sx={{ mr: 1 }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleOtpSubmit}
          color="primary"
          variant="contained"
          fullWidth
          disabled={otp.join("").length < 6}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OTPDialog;
