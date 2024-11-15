import React from "react";
import { Box, Typography } from "@mui/material";

function ControlPanel({ title, element }) {
  return (
    <Box>
      <Typography
        sx={{ color: "text.primary", fontWeight: 700, mb: 3 }}
        variant="body1"
        component="div"
        gutterBottom
      >
        {title}
      </Typography>

      <Box sx={{ color: "text.secondary" }}>{element}</Box>
    </Box>
  );
}

export default ControlPanel;
