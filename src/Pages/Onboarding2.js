import { Typography, Box, Grid, Button } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Login from "../Components/Login";
import Signup from "../Components/Signup";
import ResetPassword from "../Components/ResetPassword";
import Bridges from "../Components/Bridges";

export default function Onboarding2() {
  const { t } = useTranslation();

  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openResetDialog, setOpenResetDialog] = useState(false);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);
  const [openBridesDialog, setOpenBridesDialog] = useState(false);

  const handleOpenLogin = () => {
    setOpenLoginDialog(true);
  };

  const handleOpenBridges = () => {
    setOpenBridesDialog(true);
  };

  const handleOpenReset = () => {
    setOpenResetDialog(true);
  };

  const handleOpenSignup = () => {
    setOpenSignupDialog(true);
  };

  const handleCloseLogin = () => {
    setOpenLoginDialog(false);
  };

  const handleCloseReset = () => {
    setOpenResetDialog(false);
  };

  const handleCloseSignup = () => {
    setOpenSignupDialog(false);
  };

  const handleCloseBridges = () => {
    setOpenBridesDialog(false);
  };

  return (
    <Box sx={{ px: 5, py: 5 }}>
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
              sx={{ borderRadius: 5, px: 3, textTransform: "none", ml: 3 }}
            >
              {t("signUp")}
            </Button>
            <br/>
            <Button
              onClick={handleOpenBridges}
              size="large"
              variant="outlined"
              sx={{ borderRadius: 5, px: 3, textTransform: "none", mt: 2 }}
            >
              {t("continueWithoutAccount")}
            </Button>
          </Box>
        </Grid>
        <Grid item md={6} sm={6}>
          <Box component="img" src="login.png" sx={{ width: "80%" }} />
        </Grid>
      </Grid>
      <Login
        onClose={handleCloseLogin}
        open={openLoginDialog}
        onForgotPassword={() => {
          handleCloseLogin();
          handleOpenReset();
        }}
        asDialog={true}
      />
      <Signup
        onClose={handleCloseSignup}
        open={openSignupDialog}
        asDialog={true}
      />
      <ResetPassword
        onClose={handleCloseReset}
        open={openResetDialog}
        asDialog={true}
      />
      <Bridges
        onClose={handleCloseBridges}
        open={openBridesDialog}
        asDialog={true}
      />
    </Box>
  );
}
