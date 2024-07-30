import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Box,
} from "@mui/material";
import { MuiTelInput } from "mui-tel-input";

const TelegramAuthDialog = ({ open, onClose, onAuthenticate }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleClose = () => {
    setPhoneNumber("");
    setOtp("");
    setShowOtpDialog(false);
    onClose();
  };

  const handlePhoneNumberSubmit = async () => {
    setLoading(true);
    try {
      await window.api.getPNBACode(phoneNumber, "telegram");
      setShowOtpDialog(true);
    } catch (error) {
      setAlert({ message: error.message, severity: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async () => {
    setLoading(true);
    try {
      const longLivedToken = await window.api.retrieveParams("longLivedToken");
      const serverDevicePublicId = await window.api.retrieveParams(
        "serverDeviceId"
      );
      const clientDeviceSecretId = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );

      const llt = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      await window.api.exchangePNBACodeAndStore(
        otp,
        llt,
        phoneNumber,
        "telegram"
      );

      setAlert({
        message: "Token stored successfully",
        severity: "success",
        open: true,
      });
      onAuthenticate();
      handleClose();
    } catch (error) {
      setAlert({ message: error.message, severity: "error", open: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Box sx={{ p: 3 }}>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle sx={{ pt: 4 }}>
            Please Enter your Telegram Number
          </DialogTitle>
          <DialogContent>
            {!showOtpDialog ? (
              <>
                <MuiTelInput
                  fullWidth
                  variant="standard"
                  defaultCountry="CM"
                  value={phoneNumber}
                  onChange={setPhoneNumber}
                  disabled={loading}
                  margin="dense"
                  sx={{ mb: 2 }}
                />
                <DialogActions>
                  <Button onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handlePhoneNumberSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Submit"}
                  </Button>
                </DialogActions>
              </>
            ) : (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="OTP"
                  type="text"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                />
                <DialogActions>
                  <Button onClick={handleClose} disabled={loading}>
                    Cancel
                  </Button>
                  <Button onClick={handleOtpSubmit} disabled={loading}>
                    {loading ? <CircularProgress size={24} /> : "Verify OTP"}
                  </Button>
                </DialogActions>
              </>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    </>
  );
};

export default TelegramAuthDialog;
