import React, { useState } from "react";
import {TextField, List, ListItem, ListItemText, SwipeableDrawer, Fab } from "@mui/material";
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
    <SwipeableDrawer anchor="bottom" open={open} onClose={onClose} sx={{maxWidth:600}}>
      <List sx={{px: 5, py: 3, mx: 4}}>
        <ListItem>
          <ListItemText sx={{fontWeight: 600}} primary={t("composeEmail")} />
          <Fab>
          <FaPaperPlane onClick={handleSend} />
          </Fab>
        </ListItem>
        <ListItem>
          <TextField
          variant="standard"
            label={t("to")}
            value={to}
            onChange={(e) => setTo(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
           variant="standard"
            label="CC"
            value={cc}
            onChange={(e) => setCC(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
           variant="standard"
            label="BCC"
            value={bcc}
            onChange={(e) => setBCC(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
           variant="standard"
            label={t("subject")}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
          variant="filled"
            label={t("composeEmail")}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            multiline
            rows={8}
          />
        </ListItem>
      </List>
    </SwipeableDrawer>
  );
}
