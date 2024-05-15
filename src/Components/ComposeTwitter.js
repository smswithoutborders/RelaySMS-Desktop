import React from "react";
import { Drawer, TextField, Button, Box } from "@mui/material";

export default function TwitterCompose({ open, onClose }) {
  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <Box sx={{ p: 10 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            variant="contained"
            sx={{ borderRadius: 5, px: 3, textTransform: "none" }}
          >
            Post
          </Button>
        </Box>
        <Box>
          <TextField
            variant="filled"
            label="What's happening?"
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
