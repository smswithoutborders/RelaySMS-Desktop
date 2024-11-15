import React from "react";
import { Paper, IconButton, Typography, Box } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

function ComposeView({ children, onClose }) {
  return (
    <Paper
      elevation={3}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: 450,
        maxWidth: "100%",
        padding: 2,
        borderRadius: 2,
        boxShadow: 4,
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={1}
      >
        <Typography variant="h6">Compose</Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <Box>{children}</Box>
    </Paper>
  );
}

export default ComposeView;
