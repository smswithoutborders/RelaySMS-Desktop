import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdvancedSettings() {
  const { t } = useTranslation();
  return (
    <Box sx={{ m: 4, mt: 6 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/settings">
          <FaArrowLeft size="20px" />
        </IconButton>
        <Typography variant="h6">{t("settings")}</Typography>
      </Box>
      {/*  */}
      <Box>
        <List>
          <ListItem>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                XXX XXX XXX
              </Typography>
            </ListItemText>
            <Divider />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
