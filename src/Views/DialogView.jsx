import React, { useState } from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Divider,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";

function DialogView({
  open,
  title,
  description,
  colorName,
  onClose = null,
  onConfirm = null,
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "error",
  cancelColor = "primary",
  content = null,
}) {
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box sx={{ padding: 3, bgcolor: colorName, minWidth: 600 }}>
        <DialogTitle sx={{ fontWeight: 600 }}>{t(`ui.${title.toLowerCase()}`)}</DialogTitle>
        <Divider />
        <DialogContent>
          {description && (
            <Typography variant="body1" sx={{ color: "text.secondary", pb: 2 }}>
              {t(`ui.${description.toLowerCase()}`)}
            </Typography>
          )}
          {content}
        </DialogContent>
        <DialogActions>
          {onClose && (
            <Button
              variant="contained"
              onClick={onClose}
              color={cancelColor}
              fullWidth
              disabled={loading}
            >
              {t(`ui.${cancelText.toLowerCase()}`)}
            </Button>
          )}
          {onConfirm && (
            <Button
              variant="contained"
              onClick={handleConfirm}
              color={confirmColor}
              autoFocus
              fullWidth
              disabled={loading}
              startIcon={
                loading ? <CircularProgress size={20} color="inherit" /> : null
              }
            >
             {t(`ui.${confirmText.toLowerCase()}`)}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DialogView;
