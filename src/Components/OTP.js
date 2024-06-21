import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

function OTPDialog({ open, onClose, onSubmit, onResend }) {
  const [otp, setOtp] = useState("");
  const [counter, setCounter] = useState(60);

  useEffect(() => {
    if (open) {
      setCounter(60);
    }
  }, [open]);

  useEffect(() => {
    if (counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [counter]);

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleOtpSubmit = () => {
    onSubmit(otp);
  };

  const handleResend = () => {
    setCounter(60);
    onResend();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <Typography variant="h6">Enter OTP</Typography>
        <TextField
          autoFocus
          margin="dense"
          label="OTP"
          type="text"
          fullWidth
          value={otp}
          onChange={handleOtpChange}
        />
        <Box mt={2}>
          {counter > 0 ? (
            <Typography variant="body2">
              Resend OTP in {counter} seconds
            </Typography>
          ) : (
            <Button onClick={handleResend} color="primary">
              Resend OTP
            </Button>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOtpSubmit} color="primary">
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default OTPDialog;
