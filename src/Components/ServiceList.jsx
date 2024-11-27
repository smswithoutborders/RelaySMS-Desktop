import React, { useState } from "react";
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
import { useTranslation } from "react-i18next";

function ServiceList({
  serviceType,
  services,
  onClick,
  loading,
  lists,
  adornmentIcon,
}) {
  const [activeService, setActiveService] = useState(null);
const {t} = useTranslation();

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
        {t("no")} {serviceType}s {t("available")}
      </Typography>
    );
  }

  return (
    <List>
      {services.map((service, index) => {
        const matchingList = lists?.find((list) => list.name === service.name);

        const handleClick = (e) => {
          if (adornmentIcon) return;
          setActiveService(service.name); // Set active service
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
                    {t("common.add")}
                  </Button>
                )
              }
              disablePadding
            >
              <ListItemButton
                onClick={handleClick}
                sx={{
                  backgroundColor:
                    activeService === service.name ? "background.default" : "inherit",
                  color: activeService === service.name ? "" : "inherit",
                  borderRadius: 1,
                }}
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
                <ListItemText primary={t(`ui.${service.name.toLowerCase()}`)} />
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
                          {t("common.revoke")}
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
