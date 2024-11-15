import React from "react";
import {
  Button,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  Divider,
} from "@mui/material";

function DialogView({
  open,
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
  return (
    <Dialog open={open} onClose={onClose}>
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
            onClick={onClose}
            color={cancelColor}
            fullWidth
          >
            {cancelText}
          </Button>
          <Button
            variant="contained"
            onClick={onConfirm}
            color={confirmColor}
            autoFocus
            fullWidth
          >
            {confirmText}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}

export default DialogView;
