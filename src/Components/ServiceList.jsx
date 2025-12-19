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
  Button,
  IconButton,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import Grid from "@mui/material/Grid2";

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
        {/* <Typography className="header" variant="h5">
          {t("common.accounts management")}
        </Typography> */}
        {/* <Paper
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
        </Paper> */}
      </Grid>

      <Box
        sx={{
          bgcolor: "background.side",
          borderRadius: 2,
          opacity: 2,
          p: 3,
          mt: 1.5,
        }}
      >
        <Grid container sx={{ height: "90vh" }}>
          <Grid size={2.8}>
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
                      />
                    </ListItem>
                  ))
                : services.map((service, index) => (
                    <>
                      <ListItem
                        key={index}
                        button
                        onClick={() => handleServiceClick(service)}
                        sx={{
                          bgcolor:
                            activeService === service.name
                              ? "action.selected"
                              : "inherit",
                          borderLeftColor: "background.more",
                          py: 2,
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            src={service.avatar}
                            sx={{
                              borderRadius: 0,
                              width: 35,
                              height: 35,
                              "& img": {
                                objectFit: "contain",
                                ...(service.name.toLowerCase() === "twitter" && {
                                  filter: (theme) =>
                                    theme.palette.mode === "dark"
                                      ? "brightness(0) invert(1)"
                                      : "none",
                                }),
                              },
                            }}
                          >
                            {service.icon}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={t(`ui.${service.name.toLowerCase()}`)}
                          primaryTypographyProps={{
                            fontWeight:
                              activeService === service.name ? 600 : 400,
                          }}
                        />
                      </ListItem>
                      <Divider sx={{ opacity: 0.5 }} />
                    </>
                  ))}
            </List>
          </Grid>
          <Divider orientation="vertical" sx={{ opacity: 0.5 }} />
          <Grid size={9} sx={{ borderRadius: 3 }}>
            {activeService ? (
              <Box sx={{ px: 2 }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 3 }}
                  gutterBottom
                >
                  {t(`ui.${activeService.toLowerCase()}`)}
                </Typography>
                <Grid container justifyContent="space-between" sx={{ mb: 4 }}>
                  <Grid size={10}>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600 }}
                      gutterBottom
                    >
                      {t("common.account identifier")}
                    </Typography>
                  </Grid>
                  <Grid size={2}>
                    <Button
                      variant="contained"
                      sx={{
                        textTransform: "none",
                        bgcolor: "background.more",
                        color: "background.other",
                        "&:hover": {
                          bgcolor: "background.other",
                          color: "background.more",
                        },
                        borderRadius: 10,
                        width: "100%",
                        mb: 1,
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

                {/* <Divider sx={{ mb: 4 }} /> */}
                {lists?.find((list) => list.name === activeService)?.identifiers
                  ?.length > 0 ? (
                  lists
                    .find((list) => list.name === activeService)
                    .identifiers.map((identifier, idx) => (
                      <>
                        <ListItem
                          sx={{ py: 2 }}
                          key={idx}
                          secondaryAction={
                            <IconButton
                              color="error"
                              onClick={(e) => {
                                e.stopPropagation();
                                const service = services.find(
                                  (s) => s.name === activeService
                                );
                                onClick && onClick(service, identifier);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          }
                        >
                          <ListItemText primary={identifier} />
                        </ListItem>
                        <Divider sx={{ opacity: 0.5 }} />
                      </>
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
