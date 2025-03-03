import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { useTranslation } from "react-i18next";

function DisplayPanel({ header, body }) {
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
            className="header"
            variant="h5"
            component="div"
            gutterBottom
          >
            {header}
          </Typography>
        </>
      )}

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          py: 2,
        }}
      >
        {body}
      </Box>
    </Box>
  );
}

export default DisplayPanel;
