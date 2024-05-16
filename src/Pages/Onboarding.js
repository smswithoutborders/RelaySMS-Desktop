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
    </Box>
  );
}
