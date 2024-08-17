import React, { useState } from "react";
import { TextField, Button, Box, Dialog, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TwitterCompose({ open, onClose, accountIdentifier }) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSend = async () => {
    const number = await window.api.retrieveParams("selectedMSISDN");
    const sender = `${accountIdentifier}`;
    const text = `${sender}/n${message}`;
    const timestamp = new Date().toLocaleString();

    setLoading(true);
    try {
      await window.api.sendSMS({ text, number });
      const platform = "twitter";
      const newMessage = {
        from: accountIdentifier,
        message,
        timestamp,
        platform,
      };
      let storedMessages = await window.api.retrieveParams("messages");
      if (!storedMessages) storedMessages = [];
      storedMessages.push(newMessage);
      await window.api.storeParams("messages", storedMessages);

      setAlert({
        message: "SMS sent successfully",
        severity: "success",
        open: true,
      });
      setMessage("");
      setLoading(false);
      onClose();
    } catch (error) {
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
      console.error("Error sending SMS:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <Dialog
        PaperProps={{
          style: {
            position: "fixed",
            bottom: 0,
            right: 0,
            margin: 0,
            maxWidth: "450px",
            width: "100%",
            overflow: "hidden",
            height: "300px",
          },
        }}
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Box sx={{ p: 6, bgcolor: "background.custom" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              onClick={handleSend}
              disabled={loading}
              variant="contained"
              sx={{ borderRadius: 5, px: 3, textTransform: "none" }}
            >
              {loading ? "Loading..." : t("post")}
            </Button>
          </Box>
          <Box>
            <TextField
              variant="filled"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              label={t("twitterText")}
              fullWidth
              multiline
              rows={4}
              margin="normal"
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
