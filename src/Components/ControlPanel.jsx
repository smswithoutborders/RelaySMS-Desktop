import React from "react";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function ControlPanel({ title, element }) {
  const { t } = useTranslation();

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
        {t(`navigation.${title.toLowerCase()}`)}
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
