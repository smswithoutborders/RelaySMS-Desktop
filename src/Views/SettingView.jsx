import React from "react";
import { Box } from "@mui/material";

function SettingView({ children }) {
  return (
    <Box
      sx={{
        padding: 3,
        textAlign: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
}

export default SettingView;
