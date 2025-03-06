import { Box, Button, Grid, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "../Contexts/ThemeContext";
import { useNavigate } from "react-router-dom";
import LanguageList from "../Components/LanguageList";

export default function AppTutorial({setHasSeenTutorial}) {
  const { t } = useTranslation();
  const { logo } = useThemeMode();
  const navigate = useNavigate();

  const handleContinue = () => {
    console.log("Continue button clicked");
    localStorage.setItem("hasSeenTutorial", "true");
    setHasSeenTutorial(true);  
    navigate("/login");
    window.location.reload();
  };

  return (
    <Box height="100vh">
      <Grid container px={6}>
        <Grid item md={10}>
          <Box
            component="img"
            src={logo}
            alt="Relaysms logo"
            sx={{ width: "25%", mt: 3 }}
          />
        </Grid>
        <Grid item md={2}>
          <LanguageList />
        </Grid>
      </Grid>
      <Grid
        container
        my="auto"
        mt={10}
        justifyContent="center"
        alignItems="center"
        px={6}
      >
        <Grid item md={6} my="auto" justifyContent="space-between">
          <Typography variant="h5" sx={{ fontWeight: 600, mt: 15 }}>
            {t("tutorial.header")}
          </Typography>

          <Typography variant="body1" sx={{ mt: 7, fontSize: 18 }}>
            {t("tutorial.sub text")}
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              mt: 15,
              borderRadius: 10,
              fontSize: 17,
              px: 10,
              textTransform: "none",
              bgcolor: "background.more",
              color: "background.other",
              "&:hover": {
                bgcolor: "background.other",
                color: "background.more",
              },
            }}
            onClick={handleContinue}
          >
            {t("tutorial.continue")}
          </Button>
        </Grid>
        <Grid item md={6} my="auto" justifyContent="space-between">
          <Box
            component="img"
            src="images/relayics.svg"
            alt="Relaysms logo"
            sx={{ width: "80%" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
