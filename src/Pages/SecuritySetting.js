import React, { useState } from "react";
import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResetPasswordDialog from "../Components/NewPassword";

export default function SecuritySettings() {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [revokeDialogOpen, setRevokeDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchStoredTokens = async () => {
    try {
      const longLivedToken = await window.api.retrieveParams("longLivedToken");
      const serverDevicePublicId = await window.api.retrieveParams(
        "serverDeviceId"
      );
      const clientDeviceSecretId = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );

      const longLT = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const response = await window.api.listEntityStoredTokens(longLT);
      setTokens(response.stored_tokens);
      console.log("response:", response);
    } catch (error) {
      console.error("Failed to fetch stored tokens:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleRevokeTokensClick = () => {
    setRevokeDialogOpen(true);
    fetchStoredTokens();
  };

  const handleCloseRevokeDialog = () => {
    setRevokeDialogOpen(false);
  };

  const handleTokenRevoke = async (platform, accountIdentifier) => {
    try {
      const longLivedToken = await window.api.retrieveParams("longLivedToken");
      const serverDevicePublicId = await window.api.retrieveParams(
        "serverDeviceId"
      );
      const clientDeviceSecretId = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );

      const longLT = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const response = await window.api.RevokeAndDeleteOAuth2Token(
        longLT,
        platform,
        accountIdentifier
      );
      console.log(response);
      setAlert({
        message: "Token revoked successfully",
        severity: "success",
        open: true,
      });

      fetchStoredTokens();
    } catch (error) {
      console.error("Failed to revoke token:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
  };

  const handleConfirmDelete = async () => {
    try {
      const longLivedToken = await window.api.retrieveParams("longLivedToken");
      const clientDeviceSecretId = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );
      const serverDevicePublicId = await window.api.retrieveParams(
        "serverDeviceId"
      );

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
    } catch (error) {
      console.error("Failed to delete account:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleOpenResetPasswordDialog = () => {
    setResetPasswordDialogOpen(true);
  };

  const handleCloseResetPasswordDialog = () => {
    setResetPasswordDialogOpen(false);
  };

  return (
    <Box sx={{ m: 4, mt: 6 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/settings">
          <FaArrowLeft size="20px" />
        </IconButton>
        <Typography variant="h6">{t("settings")}</Typography>
      </Box>
      <Box>
        <List>
          <Typography sx={{ pt: 3, ml: 2 }} variant="body2">
            {t("phonelockoptions")}
          </Typography>
          <Grid container>
            <ListItem>
              <Grid item md={8} sm={8}>
                <ListItemText>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t("enablelock")}
                  </Typography>
                  <Typography variant="body2">{t("securitytext1")}</Typography>
                </ListItemText>
                <Grid item md={3} sm={3}>
                  <Switch />
                </Grid>
              </Grid>
              <Divider />
            </ListItem>
          </Grid>
          <Typography sx={{ pt: 4, ml: 2 }} variant="body2">
            {t("vault")}
          </Typography>
          <ListItem button onClick={handleRevokeTokensClick}>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("revoke")}
              </Typography>
              <Typography variant="body2">{t("securitytext2")}</Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 2 }} variant="body2">
            {t("account")}
          </Typography>
          <ListItem
            button
            onClick={handleOpenResetPasswordDialog}
            sx={{ pt: 3 }}
          >
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("resetPassword")}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("logout")}
              </Typography>
              <Typography variant="body2">{t("logouttext")}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem button onClick={handleDeleteClick} sx={{ pt: 3 }}>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("delete")}
              </Typography>
              <Typography variant="body2">{t("deletetext")}</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Box>

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

      <Dialog
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
        sx={{ my: 10, mx: 5 }}
      >
        <Box sx={{ py: 8, px: 5 }}>
          <Typography variant="h6">{t("savedPlatforms")}</Typography>
          <Typography variant="body1">{t("savedPlatforms1")}</Typography>
          <Grid container sx={{ pt: 5 }}>
            {tokens.map((token, index) => (
              <Grid item md={2} sm={3} key={index}>
                <Box
                  onClick={() =>
                    handleTokenRevoke(token.platform, token.account_identifier)
                  }
                >
                  <Box
                    component="img"
                    src={
                      token.platform === "gmail" ? "gmail.svg" : "x-twitter.svg"
                    }
                    sx={{ width: "30%" }}
                  />
                </Box>
                <Typography variant="body2">
                  {token.account_identifier}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>{t("deleteAccount")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("deleteAccountConfirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>No</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onClose={handleCloseResetPasswordDialog}
      />
    </Box>
  );
}
