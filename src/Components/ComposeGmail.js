import React, { useState } from "react";
import { Dialog, Box, Typography, Button, Input, Snackbar, Alert } from "@mui/material";
import { FaPaperPlane } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function GmailCompose({ open, onClose }) {
  const { t } = useTranslation();
  const [to, setTo] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [alert, setAlert] = useState({ message: "", severity: "" });


  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };


  const handleSend = async () => {
    console.log("handleSend function triggered"); // Debugging line
    const text = `from:frupromise1@gmail.com\nto:${to}\ncc:${cc}\nbcc:${bcc}\nsubject:${subject}\n${message}`;
    try {
      const number = await window.api.retrieveParams("selectedMSISDN");
      console.log("Retrieved number:", number); // Debugging line
      if (!number) {
        console.error("No MSISDN selected");
        return;
      }
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
            sx={{ bgcolor: "#2176AE", borderRadius: 5, textTransform: "none" }}
            size="small"
            variant="contained"
            onClick={handleSend} // Ensure this is onClick
          >
            Send <FaPaperPlane style={{ marginLeft: 4 }} />
          </Button>
        </Box>

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
