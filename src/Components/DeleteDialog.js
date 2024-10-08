import { useTranslation } from "react-i18next";
import { Box, Typography, Button, Grid, Snackbar, Alert } from "@mui/material";
import { useState } from "react";

export default function DeleteDialog() {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(true);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const [longLivedToken, serverDevicePublicId, clientDeviceSecretId] =
        await Promise.all([
          window.api.retrieveParams("longLivedToken"),
          window.api.retrieveParams("serverDeviceId"),
          window.api.retrieveParams("client_device_id_key_pair"),
        ]);

      const longLT = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const delResponse = await window.api.deleteEntity(longLT);
      console.log(delResponse);
      setAlert({
        message: "Account deleted successfully",
        severity: "success",
        open: true,
      });
      setDeleteDialogOpen(false);
      setTimeout(() => {}, 2000);
    } catch (error) {
      console.error("Failed to delete account:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  return (
    deleteDialogOpen && (
      <Box sx={{ p: 3, backgroundColor: "#FF312E", width: "100%" }}>
        <Typography>{t("deleteAccount")}</Typography>
        <br />
        <Typography sx={{ fontWeight: 600 }}>{t("deletetext")}</Typography>
        <br />
        <Typography>{t("deleteAccountConfirmation")}</Typography>
        <Grid container sx={{ pt: 2 }} columnGap={4}>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3 }}
            onClick={handleCloseDeleteDialog}
          >
            {t("no")}
          </Button>
          <Button
            component={Grid}
            variant="contained"
            item
            sm={4}
            sx={{ borderRadius: 3 }}
            onClick={handleConfirmDelete}
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
