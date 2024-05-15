import React, { useState } from "react";
import { Drawer, TextField, List, ListItem, ListItemText } from "@mui/material";
import { FaPaperPlane } from "react-icons/fa6";

export default function GmailCompose({ open, onClose }) {
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
          <ListItemText primary="Compose Email" />
          <FaPaperPlane onClick={handleSend} />
        </ListItem>
        <ListItem>
          <TextField
            label="To"
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
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            fullWidth
          />
        </ListItem>
        <ListItem>
          <TextField
            label="Compose Mail"
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
