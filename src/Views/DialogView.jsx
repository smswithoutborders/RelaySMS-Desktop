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
        <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
        <Divider />
        <DialogContent>
          {description && (
            <Typography variant="body1" sx={{ color: "text.secondary", pb: 2 }}>
              {description}
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
              {cancelText}
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
              {confirmText}
            </Button>
          )}
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DialogView;
