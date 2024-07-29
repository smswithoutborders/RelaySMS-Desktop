import React from "react";
import { Drawer, TextField, Box, Fab } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaPaperPlane } from "react-icons/fa";
import { MuiTelInput } from "mui-tel-input";

export default function TelegramCompose({ open, onClose }) {
  const { t } = useTranslation();
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Fab>
            <FaPaperPlane />
          </Fab>
        </Box>
        <Box>
          <MuiTelInput
            fullWidth
            variant="standard"
            placeholder={t("enterPhoneNumber")}
            defaultCountry="CM"
            sx={{ mb: 4 }}
          />
        </Box>
        <Box>
          <TextField
            variant="filled"
            label={t("telegramText")}
            fullWidth
            multiline
            rows={4}
            margin="normal"
          />
        </Box>
      </Box>
    </Drawer>
  );
}
