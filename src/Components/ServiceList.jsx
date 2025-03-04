import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Skeleton,
  Box,
  Divider,
  Grid,
  Button,
  Paper,
  IconButton,
} from "@mui/material";
import { Add, Delete, Search } from "@mui/icons-material";
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
  const { t } = useTranslation();

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
      <Grid container sx={{ mb: 4 }}>
        <Grid item md={10}>
          <Typography
            className="header"
            variant="h5"
            component="div"
            gutterBottom
          >
            {t("common.accounts management")}
          </Typography>
        </Grid>
        <Grid item md={2}>
          <Paper
            component="form"
            sx={{
              display: "flex",
              alignItems: "center",
              width: 250,
              borderRadius: 10,
              p: "4px 8px",
              bgcolor: "background.paper",
            }}
          >
            <Search color="action" />
            <input
              type="text"
              placeholder={t("ui.search")}
              style={{
                border: "none",
                outline: "none",
                flex: 1,
                backgroundColor: "transparent",
                color: "inherit",
                padding: "8px",
              }}
            />
          </Paper>
        </Grid>
      </Grid>
      {services.map((service, index) => {
        const matchingList = lists?.find((list) => list.name === service.name);

        const handleClick = (e) => {
          if (adornmentIcon) return;
          setActiveService(service.name);
          onClick && onClick(service);
        };

        return (
          <Box key={index}>
            <ListItem
              secondaryAction={
                adornmentIcon && (
                  <Button
                    size="large"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      onClick && onClick(service);
                    }}
                    startIcon={<Add />}
                    sx={{
                      textTransform: "none",
                      // fontSize: 9,
                      borderRadius: 10,
                      bgcolor: "background.more",
                      color: "background.other",
                      "&:hover": {
                        bgcolor: "background.other",
                        color: "background.more",
                      },
                    }}
                  >
                    {t("common.add")}
                  </Button>
                )
              }
              disablePadding
            >
              <ListItem
                onClick={handleClick}
                sx={{
                  backgroundColor:
                    activeService === service.name
                      ? "background.default"
                      : "inherit",
                  color: activeService === service.name ? "" : "inherit",
                  mt: 2,
                }}
              >
                <ListItemAvatar>
                  {service.avatar ? (
                    <Avatar sx={{ bgcolor: "transparent" }}>
                      <img
                        src={service.avatar}
                        alt={service.name}
                        style={{ width: "90%" }}
                      />
                    </Avatar>
                  ) : (
                    service.icon
                  )}
                </ListItemAvatar>
                <ListItemText
                  sx={{ fontWeight: 800 }}
                  primary={t(`ui.${service.name.toLowerCase()}`)}
                />
              </ListItem>
            </ListItem>
            <Box>
              <Grid
                container
                sx={{
                  bgcolor: "background.paper",
                  p: 1.5,
                  borderRadius: 2,
                  mt: 2,
                }}
              >
                <Grid item md={11}>
                  <Typography sx={{ fontWeight: 600, ml:3 }} variant="body2">
                    {t("common.account identifier")}
                  </Typography>
                </Grid>
                
                <Grid item md={1}>
                  <Typography sx={{ fontWeight: 600 }} variant="body2">
                    {t("common.delete token")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            {matchingList?.identifiers?.length > 0 &&
              matchingList.identifiers.map((identifier, idx) => (
                <React.Fragment key={idx}>
                  <ListItem
                    
                    secondaryAction={
                      adornmentIcon && (
                        <Button
                          size="large"
                          color="error"
                          sx={{ mr: 5 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onClick && onClick(service, identifier);
                          }}
                          startIcon={<Delete />}
                        />
                      )
                    }
                  >
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="caption" color="text.secondary">
                            {identifier}
                          </Typography>
                        }
                      />
                    </ListItem>
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
