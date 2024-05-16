import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import {
  FaArrowLeft,
  FaGlobe,
  FaShieldHalved,
  FaTowerCell,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Settings() {
  const { t } = useTranslation();
  return (
    <Box sx={{ m: 4, mt: 6 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/messages">
          <FaArrowLeft size="20px" />
        </IconButton>
        <Typography variant="h6">{t("settings")}</Typography>
      </Box>
      {/*  */}
      <Box>
        <List>
          <Typography sx={{ pt: 3, ml: 9 }} variant="body2">
            {t("accessibility")}
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaGlobe />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("language")}
              </Typography>
              <Typography variant="body2">English </Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 9 }} variant="body2">
            {t("securityAndPrivacy")}
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaShieldHalved />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("security")}
              </Typography>
              <Typography variant="body2">{t("security1")}</Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 9 }} variant="body2">
            {t("advancedSettings")}
          </Typography>
          <ListItem>
            <ListItemIcon>
              <FaTowerCell />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("gatewayClients")}
              </Typography>
              <Typography variant="body2">{t("gatewayClients1")}</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
