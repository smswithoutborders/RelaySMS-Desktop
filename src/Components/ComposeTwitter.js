import React from "react";
import { Drawer, TextField, Button, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function TwitterCompose({ open, onClose }) {
  const { t } = useTranslation();
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 5, px: 3, textTransform: "none" }}
          >
            {t("post")}
          </Button>
        </Box>
        <Box>
          <TextField
            variant="filled"
            label={t("twitterText")}
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
