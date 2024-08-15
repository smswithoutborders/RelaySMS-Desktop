import React, { useState } from "react";
import { Box, Dialog, Snackbar, Alert, Input, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";
import { MuiTelInput } from "mui-tel-input";

export default function TelegramCompose({ open, onClose }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [phoneNumber, setNumber] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSend = async () => {
    const text = `${message}`;
    const number = `${phoneNumber}`;
    try {
      await window.api.sendSMS({ text, number });
      console.log("SMS sent successfully");
      setAlert({
        message: "SMS sent successfully",
        severity: "success",
        open: true,
      });
    } catch (error) {
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
      console.error("Error sending SMS:", error);
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
          },
        }}
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Box sx={{ p: 5, bgcolor: "background.custom" }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={handleSend}
            >
              {t("send")} <FaPaperPlane />
            </Button>
          </Box>
          <Box>
            <MuiTelInput
              fullWidth
              variant="standard"
              value={phoneNumber.replace(/\s+/g, "")}
              onChange={(e) => setNumber(e.target.value)}
              placeholder={t("enterPhoneNumber")}
              defaultCountry="CM"
              sx={{ mb: 4 }}
            />
          </Box>
          <Box>
            <Input
              variant="filled"
              value={message}
              label={t("telegramText")}
              fullWidth
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={2}
              margin="normal"
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
