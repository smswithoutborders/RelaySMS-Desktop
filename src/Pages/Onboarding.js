import { Typography, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { FaChevronRight, FaGlobe } from "react-icons/fa6";
import { Link } from "react-router-dom";
import SimpleDialog from "../Components/SelectLanguage";
import { useTranslation } from "react-i18next";

export default function Onboarding() {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLanguageChange = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  return (
    <>
      <Box sx={{ px: 6, py: 10 }}>
        <Grid container>
          <Grid item md={7} sm={7} sx={{ py: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t("welcome")}
            </Typography>
            <Typography variant="h6" sx={{ opacity: "70%", pt: 10, pr: 10 }}>
              {" "}
              {t("getStarted")}{" "}
            </Typography>

            <Box sx={{ pt: 10 }}>
              <Typography variant="body1" sx={{ opacity: "70%", pb: 2 }}>
                {t("selectPrefaredLanguage")}
              </Typography>
              <Button
                onClick={handleLanguageChange}
                variant="contained"
                sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
              >
                {" "}
                <FaGlobe style={{ marginRight: 4 }} /> {t("selectLanguage")}
              </Button>
            </Box>
            <SimpleDialog onClose={handleCloseDialog} open={openDialog} />
          </Grid>
          <Grid item md={5} sm={5} my="auto">
            <Box component="img" src="welcome.png" sx={{ width: "69%" }} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
            <Typography
              component={Link}
              to="/"
              variant="body1"
              sx={{ borderRadius: 5, px: 2 }}
            >
              {t("privacyPolicy")}
            </Typography>
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
              to="/onboarding2"
              variant="contained"
              sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
            >
              {t("next")} <FaChevronRight />{" "}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
