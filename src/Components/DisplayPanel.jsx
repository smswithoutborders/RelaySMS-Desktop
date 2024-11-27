import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

function DisplayPanel({ header, body, footer }) {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {header && (
        <>
          <Typography
            sx={{ fontWeight: 700 }}
            variant="body1"
            component="div"
            gutterBottom
          >
            {header}
          </Typography>
          <Divider sx={{ mb: 2 }} />
        </>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          pb: footer ? 2 : 0,
        }}
      >
        {body}
      </Box>

      {footer && (
        <>
          <Divider sx={{ pt: 2 }} />
          <Box sx={{ pt: 2 }}>{footer}</Box>
        </>
      )}
    </Box>
  );
}

export default DisplayPanel;
