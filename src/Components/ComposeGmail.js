import React, { useState } from "react";
import {
  TextField,
  Fab,
  Dialog,
  Box,
  Typography,
} from "@mui/material";
import { FaPaperPlane } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export default function GmailCompose({ open, onClose }) {
  const { t } = useTranslation();
  const [to, setTo] = useState("");
  const [cc, setCC] = useState("");
  const [bcc, setBCC] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSend = () => {
    console.log("Sending email...");
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          position: "fixed",
          bottom: 0,
          right: 0,
          margin: 0,
          maxWidth: "600px",
          width: "100%",
          fontSize: "6px"
        },
      }}
    >
      <Box sx={{ px: 2, py: 3, backgroundColor: "background.custom" }}>
        <Box justifyContent="space-between" sx={{display: "flex"}}>
          <Typography sx={{ fontWeight: 600 }}>{t("composeEmail")}</Typography>
          <Fab>
            <FaPaperPlane onClick={handleSend} />
          </Fab>
        </Box>
        
          <TextField
          sx={{fontSize: "6px"}}
            variant="standard"
            label={t("to")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
          />
       
      <br/>
          <TextField
            variant="standard"
            label="Cc"
            value={cc}
            onChange={(e) => setCC(e.target.value)}
            fullWidth
          />
        
        <br/>
          <TextField
            variant="standard"
            label="Bcc"
            value={bcc}
            onChange={(e) => setBCC(e.target.value)}
            fullWidth
          />
        
        <br/>
          <TextField
            variant="standard"
            label={t("subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
        
        <br/>
          <TextField
            variant="standard"
            label={t("composeEmail")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={14}
          />
       
      </Box>
    </Dialog>
  );
}
