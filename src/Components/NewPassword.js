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
  Box
} from "@mui/material";
import { useTranslation } from "react-i18next";

function ResetPasswordDialog({ open, onClose }) {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "", open: false });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      setAlert({
        message: t("Passwords do not match"),
        severity: "error",
        open: true,
      });
      return;
    }

    try {
        const longLivedToken = await window.api.retrieveParams("longLivedToken");
        const serverDevicePublicId = await window.api.retrieveParams(
          "serverDeviceId"
        );
        const clientDeviceSecretId = await window.api.retrieveParams(
          "client_device_id_key_pair"
        );
  
        const longLT = await window.api.retrieveLongLivedToken({
          client_device_id_secret_key: clientDeviceSecretId.secretKey,
          server_device_id_pub_key: serverDevicePublicId,
          long_lived_token_cipher: longLivedToken,
        });
      const response = await window.api.updateEntityPassword(oldPassword, newPassword, longLT);
      setAlert({
        message: t("Password reset successful"),
        severity: "success",
        open: true,
      });
      console.log(response)
      onClose();
    } catch (error) {
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{px: 3}}>
      <DialogTitle>{t("createNewPass")}</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label={t("oldPassword")}
              type="password"
              fullWidth
              variant="standard"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label={t("newPassword")}
              type="password"
              fullWidth
              variant="standard"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </Box>
          <Box sx={{ mb: 2 }}>
            <TextField
              margin="dense"
              label={t("confirmPassword")}
              type="password"
              fullWidth
              variant="standard"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Box>
          <DialogActions>
            <Button onClick={onClose}>{t("cancel")}</Button>
            <Button type="submit" color="primary">{t("submit")}</Button>
          </DialogActions>
        </form>
      </DialogContent>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity}>
          {alert.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default ResetPasswordDialog;
