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

  const handleServiceClick = (service) => {
    setActiveService(service.name);
  };
  return (
    <Box>
      <Grid
        container
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Typography className="header" variant="h5">
          {t("common.accounts management")}
        </Typography>
        <Paper
          component="form"
          sx={{
            display: "flex",
            alignItems: "center",
            width: 250,
            p: "4px 8px",
            borderRadius: 10,
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
              padding: "8px",
            }}
          />
        </Paper>
      </Grid>

      <Box sx={{ bgcolor: "background.paper", p: 3, mt: 5 }}>
        <Grid container sx={{ bgcolor: "background.paper", height: "60vh" }}>
          <Grid item xs={3}>
          <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mb: 3 }}
                      gutterBottom
                    >
                      {t("common.platforms")}
                    </Typography>
            <List>
              {loading
                ? [...Array(5)].map((_, index) => (
                    <ListItem key={index}>
                      <ListItemAvatar>
                        <Skeleton variant="circular" width={40} height={40} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={<Skeleton variant="text" width="60%" />}
                        secondary={<Skeleton variant="text" width="40%" />}
                      />
                    </ListItem>
                  ))
                : services.map((service, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleServiceClick(service)}
                      sx={{
                        bgcolor:
                          activeService === service.name
                            ? "background.side"
                            : "inherit",
                            width: "95%",
                        borderRadius: 3
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar src={service.avatar}>{service.icon}</Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={t(`ui.${service.name.toLowerCase()}`)}
                      />
                    </ListItem>
                  ))}
            </List>
          </Grid>

          <Grid item xs={9} sx={{ bgcolor: "background.side", borderRadius: 3 }}>
            {activeService ? (
              <Box sx={{ p: 2, borderRadius: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid xs={10}>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 600, mt: 3 }}
                      gutterBottom
                    >
                      {t("common.account identifier")}
                    </Typography>
                  </Grid>
                  <Grid xs={2}>
                    <Button
                      variant="contained"
                      sx={{
                        mb: 2,
                        textTransform: "none",
                        bgcolor: "background.more",
                        color: "background.other",
                        "&:hover": {
                          bgcolor: "background.other",
                          color: "background.more",
                        },
                        borderRadius: 10,
                      }}
                      startIcon={<Add />}
                      onClick={(e) => {
                        e.stopPropagation();
                        const service = services.find(
                          (s) => s.name === activeService
                        );
                        onClick && onClick(service);
                      }}
                    >
                      {t("common.add")}
                    </Button>
                  </Grid>
                </Grid>

                <Divider sx={{ mb: 2 }} />
                {lists?.find((list) => list.name === activeService)?.identifiers
                  ?.length > 0 ? (
                  lists
                    .find((list) => list.name === activeService)
                    .identifiers.map((identifier, idx) => (
                      <ListItem
                        key={idx}
                        secondaryAction={
                          <IconButton
                            color="error"
                            onClick={(e) => {
                              e.stopPropagation();
                              const service = services.find(
                                (s) => s.name === activeService
                              );
                              onClick && onClick(service, "delete", identifier);
                            }}
                          >
                            <Delete />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={identifier} />
                      </ListItem>
                    ))
                ) : (
                  <Typography variant="body1" color="text.secondary">
                    {t("common.no tokens available")}
                  </Typography>
                )}
              </Box>
            ) : (
              <Typography variant="body1" align="center" sx={{ mt: 5 }}>
                {t("ui.select platform")}
              </Typography>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default ServiceList;
