import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Onboarding3() {
  const { t } = useTranslation();
  return (
    <Box my="auto" sx={{ px: 5, py: 10 }}>
      <Grid container>
        <Grid item md={6} sm={6} sx={{ py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("addAccounts")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
            {" "}
            {t("vaultsOnboarding2")}{" "}
          </Typography>

          <Box sx={{ pt: 10 }}>
            <Button
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              {" "}
              <FaUsers />
              {t("addAccounts")}
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="vault.png" sx={{ width: "80%" }} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={4} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
          <Button
            component={Link}
            to="/onboarding2"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            <FaChevronLeft /> {t("previous")}{" "}
          </Button>
        </Grid>
        <Grid item md={4} sx={{ position: "fixed", bottom: 50, ml :50 }}>
          <Button
            component={Link}
            to="/messages"
            variant="underlined"
            sx={{ px: 2, textTransform: "none" }}
          >
            skip
          </Button>
        </Grid>
        <Grid
          item
          md={4}
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
            to="/onboarding4"
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
