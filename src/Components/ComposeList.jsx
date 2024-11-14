import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
} from "@mui/material";

function ComposeList({ services, onServiceClick }) {
  if (!services || services.length === 0) {
    return (
      <Typography variant="body1" color="textSecondary" align="center">
        No services available
      </Typography>
    );
  }

  return (
    <List>
      {services.map((service, index) => (
        <ListItem
          key={index}
          button
          onClick={() => onServiceClick(service)}
          style={{ cursor: "pointer" }}
        >
          <ListItemAvatar>
            {service.avatar ? (
              <Avatar sx={{ bgcolor: "white" }}>
                <img
                  src={service.avatar}
                  alt={service.name}
                  style={{ width: "80%" }}
                />
              </Avatar>
            ) : (
              service.icon
            )}
          </ListItemAvatar>
          <ListItemText
            primary={service.name}I    
          />
        </ListItem>
      ))}
    </List>
  );
}

export default ComposeList;
