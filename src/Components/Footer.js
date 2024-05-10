import { Box, Button } from "@mui/material";
import React from "react";
import { FaUsers } from "react-icons/fa6";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: "fixed",
        bottom: 0,
        right: 0,
        margin: "30px",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Button variant="contained" sx={{ borderRadius: 5, px: 2 }}>
        <FaUsers /> Add Accounts
      </Button>
    </Box>
  );
}
