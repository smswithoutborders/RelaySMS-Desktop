import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { FaTrash } from "react-icons/fa";

export default function SMSMessages({ onMessageSelect, refreshMessages }) {
  const [messages, setMessages] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    const getMessages = async () => {
      try {
        const fetchedMessages = await window.api.fetchMessages()
        setMessages(fetchedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
      }
    };
    getMessages();
  }, [refreshMessages]);

  const handleContextMenu = (event, message) => {
    event.preventDefault();
    setAnchorEl(event.currentTarget);
    setSelectedMessage(message);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedMessage(null);
  };

  const handleDeleteMessage = async () => {
    if (selectedMessage) {
      const updatedMessages = messages.filter(
        (msg) => msg.timestamp !== selectedMessage.timestamp
      );
      setMessages(updatedMessages);
      refreshMessages(updatedMessages);
      setSnackbarOpen(true);
    }
    handleClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ flex: 1, overflow: "auto", p: 2 }}>
      <List>
        {messages.length === 0 ? (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body1">
                  No messages available
                </Typography>
              }
            />
          </ListItem>
        ) : (
          messages
            .slice()
            .reverse()
            .map((message, index) => (
              <ListItem
                button
                key={index}
                onClick={() => onMessageSelect(message)}
                onContextMenu={(event) => handleContextMenu(event, message)}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "lightgray" }}>
                    <Typography variant="body2">SMS</Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ display: "inline", fontSize: "15px" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {message.number}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        sx={{ display: "inline", fontSize: "13px" }}
                        component="span"
                        variant="body2"
                        color="text.secondary"
                      >
                        {message.text.slice(0, 30)}...
                      </Typography>
                      <br />
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{ display: "inline", fontSize: "10px", color: "gray" }}
                      >
                        {new Date(message.timestamp).toLocaleString()}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
        )}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
      >
        <MenuItem onClick={handleDeleteMessage}>
          <FaTrash style={{ marginRight: 8 }} />
          Delete Message
        </MenuItem>
      </Menu>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Message deleted successfully
        </Alert>
      </Snackbar>
    </Box>
  );
}
