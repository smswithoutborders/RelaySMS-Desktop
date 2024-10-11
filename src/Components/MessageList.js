import React, { useState } from "react";
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
} from "@mui/material";
import { FaTrash } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function MessageList({
  messages,
  onMessageSelect,
  refreshMessages,
}) {
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

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
      const storedMessages = await window.api.retrieveParams("messages");
      const messagesArray = Array.isArray(storedMessages) ? storedMessages : [];
      const updatedMessages = messagesArray.filter(
        (msg) => msg.timestamp !== selectedMessage.timestamp
      );
      await window.api.storeParams("messages", updatedMessages);
      refreshMessages(updatedMessages);
    }
    handleClose();
  };

  const getPlatformInfo = (platform) => {
    switch (platform) {
      case "gmail":
        return {
          name: "Gmail",
          logo: 'gmail.svg',
        };
      case "twitter":
        return {
          name: "Twitter",
          logo: 'twitter.svg',
        };
      case "telegram":
        return {
          name: "Telegram",
          logo: 'telegram.svg',
        };
      default:
        return { name: "Unknown", logo: null };
    }
  };

  return (
    <Box sx={{ flex: 1, overflow: "auto" }}>
      <List>
        {messages.length === 0 && (
          <ListItem>
            <ListItemText
              primary={
                <Typography variant="body1">{t("noMessages")}</Typography>
              }
            />
          </ListItem>
        )}
        {messages.map((message, index) => {
          const platformInfo = getPlatformInfo(message.platform);
          return (
            <ListItem
              button
              key={index}
              onClick={() => onMessageSelect(message)}
              onContextMenu={(event) => handleContextMenu(event, message)}
            >
              <ListItemAvatar>
                <Avatar sx={{ bgcolor: "white" }}>
                  {platformInfo.logo ? (
                    <img src={platformInfo.logo} alt={platformInfo.name} style={{ width: '80%' }} />
                  ) : (
                    <Typography variant="body2">{platformInfo.name}</Typography>
                  )}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                sx={{ fontSize: "9px" }}
                primary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline", fontSize: "15px" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {`${message.from}`}
                    </Typography>
                  </React.Fragment>
                }
                secondary={
                  <React.Fragment>
                    <Typography
                      sx={{ display: "inline", fontSize: "13px" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {`${message.message.slice(0, 30)}...`}
                    </Typography>
                    <br />
                    <Typography component="span"
                      variant="body2" sx={{ display: "inline", fontSize: "10px" }}>
                      {`${message.timestamp}`}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
          );
        })}
      </List>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        <MenuItem onClick={handleDeleteMessage}>
          <FaTrash style={{ marginRight: 8 }} />
          {t("deleteMessage")}
        </MenuItem>
      </Menu>
    </Box>
  );
}
