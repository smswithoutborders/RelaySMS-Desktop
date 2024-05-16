import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function IntroducingVaults() {
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
      <Box sx={{ px: 10, mt: 5 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {t("introducingVaults")}
        </Typography>
      </Box>

      <Box
        my="auto"
        justifyContent="center"
        sx={{
          px: 10,
          pr: { md: 50, sm: 5 },
        }}
      >
        <Typography variant="h4">{t("vaultsOnboarding1")}</Typography>
        <Typography variant="h6" sx={{ py: 5, opacity: "70%" }}>
          {t("vaultsOnboarding2")}
        </Typography>
        <Box sx={{ py: 5 }}>
          <Button
            component={Link}
            to="/login"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            {" "}
            {t("tryExample")}
          </Button>
        </Box>
      </Box>

      <Box
        component="footer"
        justifyContent="center"
        sx={{
          px: 10,
        }}
      >
        <Grid container>
          <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
            <Button
              component={Link}
              to="/"
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              <FaChevronLeft /> {t("previous")}{" "}
            </Button>
          </Grid>
          <Grid
            item
            md={6}
            // position="relative"
            justifyContent="flex-end"
            sx={{
              right: 0,
              display: "flex",
              position: "fixed",
              bottom: 50,
              mr: 10,
            }}
          >
            <Button
              component={Link}
              to="/done"
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              {t("next")}
              <FaChevronRight />{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
