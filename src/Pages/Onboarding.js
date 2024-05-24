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
      <Box sx={{ px: 5, py: 10 }}>
        <Grid container>
          <Grid item md={6} sm={6} sx={{ py: 10 }}>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {t("welcome")}
            </Typography>
            <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
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
          <Grid item md={6} sm={6}>
            <Box component="img" src="/pdone2.png" sx={{ width: "90%" }} />
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
      {/* <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
      }}
    >
        <Box sx={{ px: 10, mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            SMSWithoutBorders
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
          <Typography variant="h4"> {t("getStarted")} </Typography>
          <Typography variant="h6" sx={{ py: 5, opacity: "70%" }}>
            {t("selectPrefaredLanguage")}
          </Typography>
          <Box sx={{ py: 5 }}>
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
                to="/vaultsonboarding"
                variant="contained"
                sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
              >
                {t("next")} <FaChevronRight />{" "}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box> */}
    </>
  );
}
