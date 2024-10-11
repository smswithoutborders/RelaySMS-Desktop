import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Skeleton,
  Grid,
  Avatar,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import TelegramAuthDialog from "./Telegram";

export default function AddAccounts({ open, onClose, asPopover, anchorEl }) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });
  const [unstoredTokens, setUnstoredTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [telegramDialogOpen, setTelegramDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTokens = async () => {
      const isOnline = navigator.onLine;

      if (isOnline) {
        try {
          const response = await fetch(
            "https://raw.githubusercontent.com/smswithoutborders/SMSWithoutBorders-Publisher/staging/resources/platforms.json"
          );
          const data = await response.json();
          await window.api.storeParams("tokens", data);
          setUnstoredTokens(data);
        } catch (error) {
          console.error("Failed to fetch token data:", error);
          const savedTokens = await window.api.retrieveParams("tokens");
          if (savedTokens) {
            setUnstoredTokens(savedTokens);
          } else {
            setAlert({
              message:
                "Failed to fetch token data and no local data available.",
              severity: "error",
              open: true,
            });
          }
        }
      } else {
        const savedTokens = await window.api.retrieveParams("tokens");
        if (savedTokens) {
          setUnstoredTokens(savedTokens);
        } else {
          setAlert({
            message: "No internet connection and no local data available.",
            severity: "error",
            open: true,
          });
        }
      }

      setLoading(false);
    };

    fetchTokens();
  }, []);

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const handleClose = () => {
    onClose();
  };

  const handleAddAccount = async (platform) => {
    if (platform === "telegram") {
      setTelegramDialogOpen(true);
      return;
    }

    const redirectUrl =
      "https://oauth.afkanerd.com/platforms/gmail/protocols/oauth2/redirect_codes/";

    try {
      const response = await window.api.getOAuth2AuthorizationUrl(
        platform,
        "",
        "",
        true,
        redirectUrl
      );
      await window.api.storeParams("code", response.code_verifier);

      const parsedAuthUrl = new URL(response.authorization_url);
      const auth_code = await window.api.openOauth({
        oauthUrl: parsedAuthUrl.toString(),
      });
      const [longLivedToken, serverDevicePublicId, clientDeviceSecretId] =
        await Promise.all([
          window.api.retrieveParams("longLivedToken"),
          window.api.retrieveParams("serverDeviceId"),
          window.api.retrieveParams("client_device_id_key_pair"),
        ]);

      const llt = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      await window.api.exchangeOAuth2CodeAndStore(
        llt,
        platform,
        auth_code,
        response.code_verifier,
        redirectUrl
      );

      setAlert({
        message: "Token stored successfully",
        severity: "success",
        open: true,
      });

      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

  const handleTelegramAuthenticate = () => {
    setAlert({
      message: "Telegram account added successfully",
      severity: "success",
      open: true,
    });
    setTelegramDialogOpen(false);
    setTimeout(() => {
      navigate("/onboarding4");
      handleClose();
    }, 2000);
  };

  const content = (
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
      <Box sx={{ py: 2, px: 2 }}>
        <Typography sx={{ fontWeight: 600 }} variant="body2">
          {t("addAccounts")}
        </Typography>
        <br />
        <Typography variant="body2">{t("saveMultiple")}</Typography>
        {loading ? (
          <Box>
            <Grid container sx={{ py: 2 }}>
              <Grid item md={3} sm={3} sx={{ mb: 3 }}>
                <Skeleton
                  variant="circular"
                  sx={{ width: "30px", height: "30px" }}
                />
              </Grid>
              <Grid item md={8} sm={8}>
                <Skeleton variant="text" sx={{ mt: 1 }} />
              </Grid>
              {/*  */}
              <Grid item md={3} sm={3}>
                <Skeleton
                  variant="circular"
                  sx={{ width: "30px", height: "30px" }}
                />
              </Grid>
              <Grid item md={8} sm={8}>
                <Skeleton variant="text" sx={{ mt: 1 }} />
              </Grid>
            </Grid>
          </Box>
        ) : (
          unstoredTokens.map((token, index) => (
            <Box sx={{ pt: 1 }} key={index}>
              <List>
                <ListItem
                  button
                  onClick={() => handleAddAccount(token.name)}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "white" }}>
                    <Box
                      component="img"
                      src={token.icon_svg}
                      alt={token.name}
                      sx={{ width: "30px", height: "30px", marginRight: 0 }}
                    />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="body2">{token.name}</Typography>
                  </ListItemText>
                </ListItem>
              </List>
            </Box>
          ))
        )}
      </Box>
      <TelegramAuthDialog
        open={telegramDialogOpen}
        onClose={() => setTelegramDialogOpen(false)}
        onAuthenticate={handleTelegramAuthenticate}
      />
    </>
  );

  return asPopover ? (
    <Popover open={open} anchorEl={anchorEl} onClose={onClose}>
      {content}
    </Popover>
  ) : (
    <Box>{content}</Box>
  );
}
