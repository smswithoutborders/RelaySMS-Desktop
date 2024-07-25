import React, { useState, useEffect } from "react";
import {
  Grid,
  Box,
  Typography,
  Snackbar,
  Alert,
  SwipeableDrawer,
  Card,
  CardMedia,
  CardContent,
  Divider,
  Paper,
} from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });

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

      const llt = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const response = await window.api.listEntityStoredTokens(llt);
      setTokens(response.stored_tokens);
      setAlert({
        message: "Token fetched successfully",
        severity: "success",
        open: true,
      });
      await window.api.storeParams("decryptedllt", llt);
    } catch (error) {
      console.error("Failed to fetch stored tokens:", error);
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
      <SwipeableDrawer
        anchor="left"
        open={open}
        onClose={onClose}
        onOpen={() => {}}
        sx={{ my: 10, mx: 3 }}
      >
        <Box sx={{ py: 8, px: 3, width: 300 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {t("savedPlatforms")}
          </Typography>
          {/* <Typography variant="body1">{t("savedPlatforms1")}</Typography> */}
          <Box sx={{ pt: 5 }}>
            {tokens.map((token, index) => (
              <Box key={index}>
                <Grid
                  container
                  component={Paper}
                  elevation={4}
                  sx={{ my: 1, py: 2, px: 2 }}
                  onClick={
                    token.platform === "gmail"
                      ? handleGmailClick
                      : handleTwitterClick
                  }
                >
                 
                  <Grid item md={2} sm={2}>
                    <Box
                      component="img"
                      src={
                        token.platform === "gmail"
                          ? "gmail.svg"
                          : "x-twitter.svg"
                      }
                      sx={{
                        width: "80%",
                      }}
                    />
                  </Grid>
                  <Grid item md={10} sm={10}>
                    <Typography variant="body2">
                      {token.account_identifier}
                    </Typography>
                  </Grid>
                
                </Grid>
                <Divider />
              </Box>
            ))}
          </Box>
        </Box>
        <GmailCompose open={composeOpen} onClose={handleCloseCompose} />
        <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter} />
      </SwipeableDrawer>
    </>
  );
}
