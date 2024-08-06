import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { Box, Divider, Popover, Typography } from "@mui/material";

export default function SimpleDialog({ onClose, open, asPopover, anchorEl }) {
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (lang) => {
    i18n.changeLanguage(lang); 
    onClose();
  };

  const content = (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {t("selectLanguage")}
      </Typography>
      <List sx={{ px: 1 }}>
        <ListItem disableGutters>
          <ListItemButton onClick={() => handleListItemClick("en")}>
            <ListItemText variant="body2"> {t("english")} </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton onClick={() => handleListItemClick("fr")}>
            <ListItemText variant="body2"> {t("french")} </ListItemText>
          </ListItemButton>
        </ListItem>

        <ListItem disableGutters>
          <ListItemButton onClick={() => handleListItemClick("fa")}>
            <ListItemText variant="body2"> {t("farsi")} </ListItemText>
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
    </Box>
  );

  return asPopover ? (
    <Popover onClose={handleClose} open={open} anchorEl={anchorEl}>
      {content}
    </Popover>
  ) : (
    <Box>
      {content}
    </Box>
  );
}
