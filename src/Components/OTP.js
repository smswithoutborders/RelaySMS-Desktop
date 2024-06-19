import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
} from "@mui/material";

function OTPDialog({ open, onClose, onSubmit }) {
  const [otp, setOtp] = useState("");

  const handleOtpChange = (event) => {
    setOtp(event.target.value);
  };

  const handleOtpSubmit = () => {
    onSubmit(otp);
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
