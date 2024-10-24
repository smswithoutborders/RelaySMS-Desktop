import React from "react";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FaEnvelope,
  FaGithub,
  FaGlobe,
  FaNoteSticky,
  FaXTwitter,
} from "react-icons/fa6";

export default function Help({ onOpenTutorial }) {
  const { t } = useTranslation();

  const handleOpenExternalLink = (url) => {
    window.api.openExternalLink(url);
  };

  return (
    <Box sx={{ py: 2 }}>
      <Box>
        <List>
          <ListItem>
            <ListItemButton onClick={onOpenTutorial}>
              <ListItemIcon>
                <FaNoteSticky />
              </ListItemIcon>
              <ListItemText>
                {" "}
                <Typography variant="body2"> {t("appTutorials")} </Typography>
              </ListItemText>
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
              <ListItemText>
                {" "}
                <Typography variant="body2">{t("github")}</Typography>{" "}
              </ListItemText>
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
                <Typography variant="body2"> {t("twitter")} </Typography>
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
              <ListItemText>
                {" "}
                <Typography variant="body2">RelaySMS</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
          <ListItem>
            <ListItemButton>
              <ListItemIcon>
                <FaEnvelope />
              </ListItemIcon>
              <ListItemText>
                {" "}
                <Typography variant="body2">{t("mail")}</Typography>
              </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
