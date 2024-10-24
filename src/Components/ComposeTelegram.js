import React, { useState } from "react";
import { Box, Dialog, Snackbar, Alert, Input, Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";
import { MuiTelInput } from "mui-tel-input";

export default function TelegramCompose({ open, onClose, accountIdentifier }) {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [reciever, setReciever] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [loading, setLoading] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSend = async () => {
    const number = await window.api.retrieveParams("selectedMSISDN");
    const messagebody = `${accountIdentifier}:${reciever}:${message}`;
    const timestamp = new Date().toLocaleString();

    setLoading(true);
    try {
      const [client_pub_key_pair, server_pub_key] = await Promise.all([
        window.api.retrieveParams("client_publish_key_pair"),
        window.api.retrieveParams("serverPublishPubKey"),
      ]);

      const sharedSecret = await window.api.publishSharedSecret({
        client_publish_secret_key: client_pub_key_pair.secretKey,
        server_publish_pub_key: server_pub_key,
      });

      const encryptedText = await window.api.encryptMessage({
        content: messagebody,
        secretKey: sharedSecret,
        phoneNumber: number,
        publicKey: server_pub_key,
      });

      const incomingPayload = await window.api.createPayload({
        encryptedContent: encryptedText,
        pl: "T",
      });
      const text = incomingPayload;
      await window.api.sendSMS({ text, number });
      const platform = "telegram";
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

          },
        }}
        anchor="bottom"
        open={open}
        onClose={onClose}
      >
        <Box sx={{ p: 5, bgcolor: "background.custom", pb: 15 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ textTransform: "none", borderRadius: 7 }}
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "Sending..." : t("send")} <FaPaperPlane style={{marginLeft: 4}}/>
            </Button>
          </Box>
          <Box>
            <label>{t("sendTo")}:</label>
            <MuiTelInput
              fullWidth
              variant="standard"
              value={reciever}
              onChange={(value) => setReciever(value.replace(/\s+/g, ""))}
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
            />
          </Box>
        </Box>
      </Dialog>
    </>
  );
}
