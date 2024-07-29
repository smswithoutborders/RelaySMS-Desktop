import {
  Box,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Popover,
  Typography,
} from "@mui/material";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function AdvancedSettings({open, onClose}) {
  const { t } = useTranslation();
  return (
    <Popover open={open} onClose={onClose} sx={{ m: 4, mt: 6 }}>
      <Box sx={{p:4}}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {t("gatewayClients")}
        </Typography>
        <List>
          <ListItem>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                +237 000 000 000
              </Typography>
            </ListItemText>
            <Divider />
          </ListItem>
        </List>
      </Box>
    </Popover>
  );
}
