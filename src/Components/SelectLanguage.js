// SimpleDialog.js
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { Box, Popover, Typography } from "@mui/material";

export default function SimpleDialog({ onClose, open }) {
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (lang) => {
    i18n.changeLanguage(lang); // Change the language
    onClose();
  };

  return (
    <Popover onClose={handleClose} open={open}>
      <Box sx={{ py: 3, px: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("selectLanguage")}
        </Typography>
        <List sx={{ pt: 2 }}>
          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("en")}>
              <ListItemText> English </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("fr")}>
              <ListItemText> French </ListItemText>
            </ListItemButton>
          </ListItem>

          <ListItem disableGutters>
            <ListItemButton onClick={() => handleListItemClick("fa")}>
              <ListItemText> Farsi</ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Popover>
  );
}
