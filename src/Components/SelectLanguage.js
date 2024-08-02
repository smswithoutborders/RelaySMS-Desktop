import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { Box, Divider, Popover, Typography } from "@mui/material";

export default function SimpleDialog({ onClose, open }) {
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (lang) => {
    i18n.changeLanguage(lang); 
    onClose();
  };

  return (
    <Popover onClose={handleClose} open={open}>
      <Box sx={{ py: 3, px: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 600 }}>
          {t("selectLanguage")}
        </Typography>
        <Divider/>
        <List sx={{ px: 1 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("en")}>
              <ListItemText> {t("english")} </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("fr")}>
              <ListItemText> {t("french")} </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("fa")}>
              <ListItemText> {t("farsi")}</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
        <Divider/>
      </Box>
    </Popover>
  );
}
