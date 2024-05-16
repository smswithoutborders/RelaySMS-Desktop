import { Typography, Box } from "@mui/material";
import React from "react";
import Footer from "../Components/Footer";
import Nav from "../Components/Nav";
import { useTranslation } from "react-i18next";

export default function Landing() {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <Nav />
      <Box sx={{ px: 10, mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t("recent")} {/* Translate "Recent" */}
        </Typography>
      </Box>
      {/*  */}
      <Box
        my="auto"
        justifyContent="center"
        sx={{
          px: 10,
          pr: { md: 50, sm: 5 },
        }}
      >
        <Typography variant="h4">{t("noRecentMessages")}</Typography>
      </Box>

      <Footer />
    </Box>
  );
}
