import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Done() {
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
          {t("done")}
        </Typography>
      </Box>

      <Box
        my="auto"
        display="flex"
        justifyContent="center"
        sx={{
          px: 10,
        }}
      >
        <Typography variant="h4" sx={{ pr: { md: 50, sm: 5 } }}>
          {t("tourComplete")}
        </Typography>
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
              to="/vaultsonboarding"
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
              to="/messages"
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              {t("finish")} <FaChevronRight />{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
