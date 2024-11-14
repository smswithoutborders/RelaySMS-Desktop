import React, { useState } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Input,
} from "@mui/material";
import { Search } from "@mui/icons-material";

function MessageList({ messages = [], onClick }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMessages = messages.filter(
    (message) =>
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <FormControl sx={{ width: "100%" }} variant="standard">
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
      <List>
        {filteredMessages.length > 0 ? (
          filteredMessages.map((message, index) => (
            <ListItem
              key={index}
              alignItems="flex-start"
              button
              onClick={() => onClick && onClick(message)}
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
                      {new Date(message.date).toLocaleDateString()}
                    </Typography>
                  </>
                }
              />
            </ListItem>
          ))
        ) : (
          <Typography variant="body1" color="text.secondary" sx={{ pt: 3 }}>
            No message to display
          </Typography>
        )}
      </List>
    </div>
  );
}

export default MessageList;
