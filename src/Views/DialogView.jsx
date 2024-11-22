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
  onClose,
  title,
  description,
  onConfirm,
  colorName,
  confirmText = "Yes",
  cancelText = "No",
  confirmColor = "error",
  cancelColor = "primary",
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(true);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  const handleClose = async () => {
    try {
      if (onClose) await onClose();
    } finally {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <Box sx={{ padding: 3, bgcolor: colorName }}>
        <DialogTitle sx={{ fontWeight: 600 }}>{title}</DialogTitle>
        <Divider />
        <DialogContent>
          <Typography variant="body1" sx={{ color: "text.secondary", pb: 2 }}>
            {description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleClose}
            color={cancelColor}
            fullWidth
            disabled={loading}
          >
            {cancelText}
          </Button>
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
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DialogView;
