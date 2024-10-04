import { Typography, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { FaGlobe } from "react-icons/fa6";
import SimpleDialog from "../Components/SelectLanguage";
import { useTranslation } from "react-i18next";

export default function Onboarding() {
  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageChange = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setAnchorEl(null);
  };

  const handleOpenExternalLink = (url) => {
    window.api.openExternalLink(url);
  };
  return (
    <>
      <Box sx={{ px: 6, py: 5 }}>
        <Grid container my="auto" sx={{ overflow: "hidden" }}>
          <Grid item md={7} sm={7} sx={{ py: 10 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {t("welcome")}
            </Typography>
            <Typography variant="body1" sx={{ opacity: "70%", pt: 4, pr: 10 }}>
              {" "}
              {t("getStarted")}{" "}
            </Typography>

            <Box>
              <Typography variant="body2" sx={{ opacity: "70%", pb: 2, pt: 6 }}>
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
            <SimpleDialog
              onClose={handleCloseDialog}
              open={openDialog}
              asPopover={true}
              anchorEl={anchorEl}
            />
          </Grid>
          <Grid item md={5} sm={5} my="auto">
            <Box component="img" src="welcome.png" sx={{ width: "69%" }} />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 10 }}>
            <Typography
              onClick={() =>
                handleOpenExternalLink("https://smswithoutborders.com/privacy-policy")
              }
              variant="body1"
              sx={{ borderRadius: 5, px: 2 }}
            >
              {t("acceptPrivacyPolicy", "termsandconditions")}
            </Typography>
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
          ></Grid>
        </Grid>
      </Box>
    </>
  );
}
