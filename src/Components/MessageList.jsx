import React, { useState } from "react";
import {
  Avatar,
  List,
  ListItemAvatar,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Input,
  ListItemButton,
  Box,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { formatDistanceToNow } from "date-fns";

function MessageList({ messages = [], onClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages.filter(
    (message) =>
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <FormControl
        sx={{
          width: "100%",
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
        }}
        variant="standard"
      >
        <InputLabel sx={{ fontSize: "13px" }}>Search Messages</InputLabel>
        <Input
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          id="search-icon"
          endAdornment={
            <InputAdornment position="end">
              <IconButton aria-label="search icon">
                <Search size="13px" />
              </IconButton>
            </InputAdornment>
          }
        />
      </FormControl>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          mt: 1,
        }}
      >
        <List>
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message, index) => (
              <ListItemButton
                key={index}
                alignItems="flex-start"
                onClick={() => onClick && onClick(message)}
                sx={{ cursor: "pointer" }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "white" }}>
                    <img
                      src={message.avatar}
                      alt={message.title}
                      style={{ width: "80%" }}
                    />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      sx={{ fontWeight: 600, color: "text.primary" }}
                      variant="body1"
                      component="span"
                    >
                      {message.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        component="span"
                      >
                        {message.text.slice(0, 50)}...
                      </Typography>
                      <Typography
                        variant="caption"
                        color="gray"
                        style={{
                          display: "block",
                          textAlign: "right",
                          marginTop: 4,
                        }}
                      >
                        {formatDistanceToNow(new Date(message.date), {
                          addSuffix: true,
                        })}
                      </Typography>
                    </>
                  }
                />
              </ListItemButton>
            ))
          ) : (
            <Typography variant="body1" color="text.secondary" sx={{ pt: 3 }}>
              No message to display
            </Typography>
          )}
        </List>
      </Box>
    </Box>
  );
}

export default MessageList;
