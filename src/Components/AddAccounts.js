import React, { useState } from "react";
import url from "url";
import { Grid, Box, Typography, Dialog, Snackbar, Alert } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function AddAccounts({ open, onClose }) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [unstoredTokens] = useState([
    { platform: "gmail" },
    { platform: "twitter" },
  ]);
  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };
  const navigate = useNavigate();

  const handleClose = () => {
    onClose();    
  };

  const handleAddAccount = async (platform) => {
    try {
      const response = await window.api.getOAuth2AuthorizationUrl(
        platform,
        "",
        "",
        true
      );
      await window.api.storeParams("code", response.code_verifier);

      const parsedAuthUrl = new URL(response.authorization_url);
      const parsedRedirecthUrl = new URL(response.redirect_url);
      const newRedirectUri = url.resolve(
        "http://localhost:18000",
        parsedRedirecthUrl.pathname
      );
      parsedAuthUrl.searchParams.set("redirect_uri", newRedirectUri);

      const auth_code = await window.api.openOauth({
        oauthUrl: parsedAuthUrl.toString(),
        expectedRedirect: newRedirectUri,
      });

      const longLivedToken = await window.api.retrieveParams("longLivedToken");
      const serverDevicePublicId = await window.api.retrieveParams(
        "serverDeviceId"
      );
      const clientDeviceSecretId = await window.api.retrieveParams(
        "client_device_id_key_pair"
      );

      const llt = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const store = await window.api.exchangeOAuth2CodeAndStore(
        llt,
        platform,
        auth_code,
        response.code_verifier
      );
      console.log(store);
      setAlert({
        message: "Token stored successfully",
        severity: "success",
        open: true,
      });
      
      setTimeout(() => {
        navigate("/onboarding4"); 
        handleClose();
      }, 2000);
    } catch (error) {
      console.error("Failed to get OAuth2 authorization URL:", error);
      setAlert({
        message: error,
        severity: "success",
        open: true,
      });
    }
  };

  return (
    <>
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
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ my: 10, mx: 5 }}
    >
      <Box sx={{ py: 8, px: 5 }}>
        <Typography variant="h6" textAlign="center">
          Add Accounts
        </Typography>
        <Typography sx={{ pt: 2 }} variant="body1" textAlign="center">
          Adding accounts blah blah blah
        </Typography>
        <Grid
          container
          sx={{ pt: 6 }}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          {unstoredTokens.map((token, index) => (
            <Grid
              item
              md={4}
              sm={6}
              xs={12}
              key={index}
              sx={{ textAlign: "center" }}
            >
              <Box onClick={() => handleAddAccount(token.platform)}>
                <img
                  src={`/${token.platform}.svg`} 
                  alt={token.platform}
                  style={{ width: "30%", cursor: "pointer" }}
                />
              </Box>
              <Typography variant="body2">{token.platform}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Dialog>
    </>
  );
}
