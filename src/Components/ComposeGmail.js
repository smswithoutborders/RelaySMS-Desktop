import React, { useState } from "react";
import {
  Dialog,
  Box,
  Typography,
  Button,
  Input,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaPaperPlane } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function GmailCompose({ open, onClose, accountIdentifier }) {
  const { t } = useTranslation();
  const [to, setTo] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [loading, setLoading] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleSend = async () => {
    const phoneNumber = await window.api.retrieveParams("phone_number");
    const messagebody = `${accountIdentifier}:${to}:${cc}:${bcc}:${subject}:${message}`;
    const timestamp = new Date().toLocaleString();

    setLoading(true);
    try {
      const number = await window.api.retrieveParams("selectedMSISDN");
      if (!number) {
        setAlert({
          message: "No MSISDN selected, please select a gateway client",
          severity: "error",
          open: true,
        });
        setLoading(false); 
        return;
      }

      const [client_pub_key_pair, server_pub_key,] =
      await Promise.all([
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
        phoneNumber: phoneNumber,
        publicKey: server_pub_key,
      });

      const incomingPayload = await window.api.createPayload({
        encryptedContent: encryptedText,
        pl: "g",
      });
      const text = incomingPayload;
      await window.api.sendSMS({ text, number });
      const platform = "gmail";
      const newMessage = {
        from: accountIdentifier,
        to,
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
      setTo("");
      setCC("");
      setBCC("");
      setSubject("");
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
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            position: "fixed",
            bottom: 0,
            right: 0,
            margin: 0,
            maxWidth: "450px",
            width: "100%",
            overflow: "hidden",
            height: "600px",
            mr: 4,
          },
        }}
      >
        <Box sx={{ px: 2, py: 3, backgroundColor: "background.custom" }}>
          <Box justifyContent="space-between" sx={{ display: "flex" }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {t("composeEmail")}
            </Typography>

            <Button
              sx={{
                bgcolor: "#2176AE",
                borderRadius: 5,
                textTransform: "none",
              }}
              size="small"
              variant="contained"
              onClick={handleSend}
              disabled={loading}
            >
              {loading ? "Sending..." : t("send")}{" "}
              <FaPaperPlane style={{ marginLeft: 4 }} />
            </Button>
          </Box>
          <Input
            size="small"
            sx={{ py: 1 }}
            placeholder="From"
            value={accountIdentifier}
            fullWidth
            disabled
          />

          <Input
            size="small"
            sx={{ py: 1 }}
            placeholder={t("to")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
          />
          <Input
            sx={{ py: 1 }}
            size="small"
            placeholder="Cc"
            value={cc}
            onChange={(e) => setCC(e.target.value)}
            fullWidth
          />
          <Input
            sx={{ py: 1 }}
            size="small"
            placeholder="Bcc"
            value={bcc}
            onChange={(e) => setBCC(e.target.value)}
            fullWidth
          />
          <Input
            sx={{ py: 1 }}
            size="small"
            placeholder={t("subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
          <Input
            sx={{ py: 1 }}
            size="small"
            placeholder={t("composeEmail")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={14}
          />
        </Box>
      </Dialog>
    </>
  );
}
