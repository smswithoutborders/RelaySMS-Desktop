import React from "react";
import { Box, Typography } from "@mui/material";

function ControlPanel({ title, element }) {
  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography
        sx={{
          color: "text.primary",
          fontWeight: 700,
          position: "sticky",
          top: 0,
          bgcolor: "background.paper",
          zIndex: 1,
        }}
        variant="body1"
        component="div"
        gutterBottom
      >
        {title}
      </Typography>

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          color: "text.secondary",
        }}
      >
        {element}
      </Box>
    </Box>
  );
}

export default ControlPanel;
