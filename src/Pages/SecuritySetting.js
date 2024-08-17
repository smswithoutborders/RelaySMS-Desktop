import React, { useState } from "react";
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
  Snackbar,
  Alert,
  Button,
  Popover,
  ListItemAvatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ResetPasswordDialog from "../Components/NewPassword";

export default function SecuritySettings({ open, onClose }) {
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
  
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();
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
      setTimeout(() => {
        navigate("/onboarding2"); 
        handleClose();
      }, 2000);
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
    <Box>
      <Box open={open} onClose={onClose} >
        <Box sx={{px:1, py: 3}}>
      <Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
          {t("menuItems")}
        </Typography>
        <List sx={{pt:1}}>
          <ListItem button onClick={handleRevokeTokensClick}>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("revoke")}
              </Typography>
            </ListItemText>
          </ListItem>

          <ListItem
            button
            onClick={handleOpenResetPasswordDialog}
          >
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("resetPassword")}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("logout")}
              </Typography>
            </ListItemText>
          </ListItem>
          <ListItem button onClick={handleDeleteClick} >
            <ListItemText>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {t("delete")}
              </Typography>
            </ListItemText>
          </ListItem>
        </List>
        </Box>
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

      <Popover
        open={revokeDialogOpen}
        onClose={handleCloseRevokeDialog}
       
      >
        <Box sx={{ py: 4, px: 2 }}>
          <Typography variant="body2" sx={{fontWeight: 600}}>{t("savedAccounts")}</Typography>
          <List>
            {tokens.map((token, index) => (
              <List key={index}>
                <ListItem
                  sx={{ display: "flex", alignItems: "center" }}
                  onClick={() =>
                    handleTokenRevoke(token.platform, token.account_identifier)
                  }
                >
                  <ListItemAvatar>
                    <Box
                      component="img"
                      src={
                        token.platform === "gmail"
                          ? "gmail.svg"
                          : "x-twitter.svg"
                      }
                      sx={{ width: "40px", height: "40px", marginRight: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="body2">
                      {token.account_identifier}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            ))}
          </List>
        </Box>
      </Popover>

      <Popover open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <Box sx={{ p: 3, backgroundColor: "#FF312E", width: "400px" }}>
          <Typography>{t("deleteAccount")}</Typography>
          <br />
          <Typography sx={{fontWeight: 600}}>{t("deletetext")}</Typography>
          <br />
          <Typography >{t("deleteAccountConfirmation")}</Typography>
          <Grid container sx={{pt: 2}} columnGap={4}>
            <Button
              component={Grid}
              variant="contained"
              item
              sm={4}
              sx={{borderRadius: 3}}
              onClick={handleCloseDeleteDialog}
            >
              {t("no")}
            </Button>
            <Button
              component={Grid}
              variant="contained"
              item
              sm={4}
              sx={{borderRadius: 3}}
              onClick={handleConfirmDelete}
              color="primary"
            >
              {t("yes")}
            </Button>
          </Grid>
        </Box>
      </Popover>

      <ResetPasswordDialog
        open={resetPasswordDialogOpen}
        onClose={handleCloseResetPasswordDialog}
      />
    </Box>
  );
}
