import { Typography, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

export default function Onboarding2() {
  const { t } = useTranslation();

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);

  const handleOpenLogin = () => {
    setOpenLoginDialog(true);
  };

  const handleOpenSignup = () => {
    setOpenSignupDialog(true);
  };

  const handleCloseLogin = () => {
    setOpenLoginDialog(false);
  };

  const handleCloseSignup = () => {
    setOpenSignupDialog(false);
  };

  return (
    <Box sx={{ px: 5, py: 10 }}>
      <Grid container>
        <Grid item md={6} sm={6} sx={{ py: 10 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("login")}
          </Typography>
          <Typography variant="h6" sx={{ opacity: "70%", pt: 10 }}>
            {t("vaultsOnboarding1")}
          </Typography>
          <Box sx={{ pt: 10 }}>
            <Button
              onClick={handleOpenLogin}
              size="large"
              variant="outlined"
              sx={{ borderRadius: 5, px: 3, textTransform: "none" }}
            >
              {t("login")}
            </Button>
            <Button
              onClick={handleOpenSignup}
              size="large"
              variant="outlined"
              sx={{ borderRadius: 5, px: 3, textTransform: "none", ml: 6 }}
            >
              {t("signUp")}
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="login.png" sx={{ width: "80%" }} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={6} sx={{ position: "fixed", bottom: 50, mr: 20 }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            <FaChevronLeft /> {t("previous")}
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
          {/* <Button
            component={Link}
            to="/onboarding3"
            variant="contained"
            sx={{ borderRadius: 5, px: 2, textTransform: "none" }}
          >
            {t("next")}
            <FaChevronRight />
          </Button> */}
        </Grid>
      </Grid>
      <Login onClose={handleCloseLogin} open={openLoginDialog} />
      <Signup onClose={handleCloseSignup} open={openSignupDialog} />
    </Box>
  );
}
