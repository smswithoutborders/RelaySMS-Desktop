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
  Box,
  Divider,
  Button,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

function ServiceList({
  serviceType,
  services,
  onClick,
  loading,
  lists,
  adornmentIcon,
}) {
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
      {services.map((service, index) => {
        const matchingList = lists?.find((list) => list.name === service.name);

        const handleClick = (e) => {
          if (adornmentIcon) return;
          onClick && onClick(service);
        };

        return (
          <Box key={index} sx={{ mb: 2 }}>
            <ListItem
              secondaryAction={
                adornmentIcon && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick && onClick(service);
                    }}
                    startIcon={<Add />}
                    sx={{ textTransform: "none", fontSize: 9 }}
                  >
                    Add
                  </Button>
                )
              }
              disablePadding
            >
              <ListItemButton onClick={handleClick}>
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
            </ListItem>

            {matchingList?.identifiers?.length > 0 &&
              matchingList.identifiers.map((identifier, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    sx={{ pl: 1 }}
                    secondaryAction={
                      adornmentIcon && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={(e) => {
                            e.stopPropagation();
                            onClick && onClick(service, identifier);
                          }}
                          startIcon={<Delete />}
                          sx={{ textTransform: "none", fontSize: 9 }}
                        >
                          Revoke
                        </Button>
                      )
                    }
                  >
                    <ListItemButton>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary">
                            {identifier}
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </React.Fragment>
              ))}
            <Divider />
          </Box>
        );
      })}
    </List>
  );
}

export default ServiceList;
