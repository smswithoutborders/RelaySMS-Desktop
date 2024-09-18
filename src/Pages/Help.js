import React from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  FaChevronLeft,
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaNoteSticky,
  FaXTwitter,
} from "react-icons/fa6";

export default function Help() {
  const { t } = useTranslation();

  const handleOpenExternalLink = (url) => {
    window.api.openExternalLink(url);
  };

  return (
    <Box sx={{ m: 5 }}>
      <Button sx={{ textTransform: "none" }} component={Link} to="/messages">
        <FaChevronLeft />
        <Typography variant="body2">{t("messages")}</Typography>
      </Button>
      <Box sx={{ my: 3, mx: 6 }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          {t("welcome")}
        </Typography>
        <Typography variant="body1">{t("getStarted")}</Typography>
        <List>
          <ListItem>
            <ListItemButton component={Link} to="/tutorial">
              <ListItemIcon>
                <FaNoteSticky />
              </ListItemIcon>
              <ListItemText>{t("appTutorials")}</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() =>
                handleOpenExternalLink("https://github.com/smswithoutborders")
              }
            >
              <ListItemIcon>
                <FaGithub />
              </ListItemIcon>
              <ListItemText>{t("github")} </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() => handleOpenExternalLink("https://x.com/RelaySMS")}
            >
              <ListItemIcon>
                <FaXTwitter />
              </ListItemIcon>
              <ListItemText>
               {t("twitterFollow")}
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton
              onClick={() =>
                handleOpenExternalLink("https://relay.smswithoutborders.com")
              }
            >
              <ListItemIcon>
                <FaGlobe />
              </ListItemIcon>
              <ListItemText>relay.smswithoutborders.com</ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <FaEnvelope />
              </ListItemIcon>
              <ListItemText>developers@smswithoutborders.com</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
