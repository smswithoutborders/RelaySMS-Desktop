import React, { useState } from "react";
import { Drawer, TextField, List, ListItem, ListItemText } from "@mui/material";
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
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <List>
        <ListItem>
          <ListItemText primary={t("composeEmail")} />
          <FaPaperPlane onClick={handleSend} />
        </ListItem>
        <ListItem>
          <TextField
            label={t("to")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
            label="CC"
            value={cc}
            onChange={(e) => setCC(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
            label="BCC"
            value={bcc}
            onChange={(e) => setBCC(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
            label={t("subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
            label={t("composeEmail")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
        </ListItem>
      </List>
    </Drawer>
  );
}
