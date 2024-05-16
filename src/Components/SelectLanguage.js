// SimpleDialog.js
import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useTranslation } from "react-i18next";

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
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{t("selectLanguage")}</DialogTitle>
      <List sx={{ pt: 0 }}>
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
    </Dialog>
  );
}
