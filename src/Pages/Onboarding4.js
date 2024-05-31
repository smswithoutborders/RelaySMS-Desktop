import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Onboarding4() {
  const { t } = useTranslation();
  return (
    <Box sx={{ px: 5, py: 10 }}>
      <Grid
        container
        columnSpacing={4}
        justifyContent="center"
        my="auto"
        alignItems="center"
        display="flex"
      >
        <Grid item md={6} sm={6} sx={{ py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("done")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
            {" "}
            {t("tourComplete")}{" "}
          </Typography>
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="add.png" sx={{ width: "90%" }} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
          <Button
            component={Link}
            to="/onboarding3"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            <FaChevronLeft /> {t("previous")}{" "}
          </Button>
        </Grid>
        <Grid
          item
          md={6}
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
            {t("next")} <FaChevronRight />{" "}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
