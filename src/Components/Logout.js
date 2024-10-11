import { useTranslation } from "react-i18next";
import { Box, Typography, Snackbar, Alert, Grid, Button } from "@mui/material";
import { useState } from "react";

export default function Logout({ onLogoutSuccess }) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [logoutOpen, setLogoutOpen] = useState(true);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCloseLogout = () => {
    setLogoutOpen(false);
  };

  const handleLogout = async () => {
    try {
      await window.api.logout();
      setAlert({
        message: "Logged out successfully",
        severity: "success",
        open: true,
      });
      onLogoutSuccess();
      setTimeout(() => {
        setLogoutOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to logout:", error);
      setAlert({
        message: "Logout failed. Please try again.",
        severity: "error",
        open: true,
      });
    }
  };

  return (
    logoutOpen && (
      <Box sx={{ p: 3, backgroundColor: "#FF312E", width: "100%", color: "white" }}>
        <Typography>{t("logout")}</Typography>
        <br />
        <Typography>{t("logouttext")}</Typography>
        <Grid container sx={{ pt: 2 }} columnGap={4}>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3, bgcolor: "white", color: "black" }}
            onClick={handleCloseLogout}
          >
            {t("no")}
          </Button>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3, bgcolor: "white", color: "black" }}
            onClick={handleLogout}
            color="primary"
          >
            {t("yes")}
          </Button>
        </Grid>
        <Snackbar
          open={alert.open}
          autoHideDuration={6000}
          onClose={handleAlertClose}
        >
          <Alert
            onClose={handleAlertClose}
            severity={alert.severity}
            sx={{ width: "100%" }}
          >
            {alert.message}
          </Alert>
        </Snackbar>
      </Box>
    )
  );
}
