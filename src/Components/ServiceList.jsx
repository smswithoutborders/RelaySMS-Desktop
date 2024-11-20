import React from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Skeleton,
  ListItemButton,
} from "@mui/material";

function ServiceList({ serviceType, services, onClick, loading }) {
  if (loading) {
    return (
      <List>
        {[...Array(5)].map((_, index) => (
          <ListItem key={index}>
            <ListItemAvatar>
              <Skeleton variant="circular" width={40} height={40} />
            </ListItemAvatar>
            <ListItemText
              primary={<Skeleton variant="text" width="60%" />}
              secondary={<Skeleton variant="text" width="40%" />}
            />
          </ListItem>
        ))}
      </List>
    );
  }

  if (!services || services.length === 0) {
    return (
      <Typography variant="body1" color="text.secondary" sx={{ pt: 3 }}>
        No {serviceType}s available
      </Typography>
    );
  }

  return (
    <List>
      {services.map((service, index) => (
        <ListItemButton
          key={index}
          onClick={() => onClick && onClick(service)}
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
          <ListItemText primary={service.name} />
        </ListItemButton>
      ))}
    </List>
  );
}

export default ServiceList;
