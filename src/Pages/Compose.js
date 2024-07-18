import React, { useState, useEffect } from "react";
import { Grid, Box, Typography, Snackbar, Alert, Dialog } from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function Compose({ open, onClose }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });

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
      const serverDevicePublicId = await window.api.retrieveParams("serverDeviceId");
      const clientDeviceSecretId = await window.api.retrieveParams("client_device_id_key_pair");

      const llt = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const response = await window.api.listEntityStoredTokens(llt);
      setTokens(response.stored_tokens);
      console.log('response:', response);
      setAlert({
        message: "Token stored successfully",
        severity: "success",
        open: true,
      });

      setTimeout(() => {
        navigate("/onboarding3");
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to fetch stored tokens:', error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  useEffect(() => {
    if (open) {
      fetchStoredTokens();
    }
  }, [open]);

  const handleGmailClick = () => {
    setComposeOpen(true);
    setTwitterOpen(false);
  };

  const handleTwitterClick = () => {
    setTwitterOpen(true);
    setComposeOpen(false);
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
  };

  const handleCloseTwitter = () => {
    setTwitterOpen(false);
  };

  return (
    <>
      <Snackbar open={alert.open} autoHideDuration={6000} onClose={handleAlertClose}>
        <Alert onClose={handleAlertClose} severity={alert.severity} sx={{ width: "100%" }}>
          {alert.message}
        </Alert>
      </Snackbar>
      <Dialog anchor="bottom" open={open} onClose={onClose} sx={{ my: 10, mx: 5 }}>
        <Box sx={{ py: 8, px: 5 }}>
          <Typography variant="h6">{t("savedPlatforms")}</Typography>
          <Typography variant="body1">{t("savedPlatforms1")}</Typography>
          <Grid container sx={{ pt: 5 }}>
            {tokens.map((token, index) => (
              <Grid item md={2} sm={3} key={index}>
                <Box onClick={token.platform === "gmail" ? handleGmailClick : handleTwitterClick}>
                  <Box
                    component="img"
                    src={token.platform === "gmail" ? "gmail.svg" : "x-twitter.svg"}
                    sx={{ width: "30%" }}
                  />
                </Box>
                <Typography variant="body2">{token.account_identifier}</Typography>
              </Grid>
            ))}
          </Grid>
        </Box>
        <GmailCompose open={composeOpen} onClose={handleCloseCompose} />
        <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter} />
      </Dialog>
    </>
  );
}
