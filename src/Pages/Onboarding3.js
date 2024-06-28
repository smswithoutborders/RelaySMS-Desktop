import { Typography, Box, Grid, Button } from "@mui/material";
import React from "react";
import { FaChevronLeft, FaChevronRight, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Onboarding3() {
  const { t } = useTranslation();
  return (
    <Box sx={{ px: 5, py: 10 }}>
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
        <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
          <Button
            component={Link}
            to="/onboarding2"
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
            to="/onboarding4"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            {t("next")} <FaChevronRight />{" "}
          </Button>
        </Grid>
      </Grid>
      {/*  */}
      {/*  */}
      {/* <Box sx={{ px: 10, mt: 5 }}>
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
      </Box> */}
    </Box>
  );
}
