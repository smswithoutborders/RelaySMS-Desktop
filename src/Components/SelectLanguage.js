import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useTranslation } from "react-i18next";
import { Box, Popover, Typography } from "@mui/material";

export default function SimpleDialog({ onClose, open, asPopover, anchorEl }) {
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (lang) => {
    i18n.changeLanguage(lang);
  };

  const content = (
    <Box sx={{ py: 3, px: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {t("selectLanguage")}
      </Typography>
      <List sx={{ pt: 2 }}>
        <ListItem button>
          <ListItemText onClick={() => handleListItemClick("en")}>
            {" "}
            <Typography variant="body2">{t("english")}</Typography>{" "}
          </ListItemText>
        </ListItem>

        <ListItem button>
          <ListItemText onClick={() => handleListItemClick("fr")}>
            {" "}
            <Typography variant="body2"> {t("french")}</Typography>{" "}
          </ListItemText>
        </ListItem>

        <ListItem button>
          <ListItemText onClick={() => handleListItemClick("fa")}>
            {" "}
            <Typography variant="body2"> {t("farsi")}</Typography>{" "}
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );

  return asPopover ? (
    <Popover onClose={handleClose} open={open} anchorEl={anchorEl}>
      {content}
    </Popover>
  ) : (
    <Box>{content}</Box>
  );
}
