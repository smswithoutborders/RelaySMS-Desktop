import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";

export default function SimpleDialog(props) {
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select language</DialogTitle>
      <List sx={{ pt: 0 }}>
        <ListItem disableGutters>
          <ListItemButton onClick={() => handleListItemClick()}>
            <ListItemText> English </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton onClick={() => handleListItemClick()}>
            <ListItemText> French </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton autoFocus onClick={() => handleListItemClick()}>
            <ListItemText> Farsi</ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
    </Dialog>
  );
}
