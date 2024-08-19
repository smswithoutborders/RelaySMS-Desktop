import React, { useState, useEffect } from "react";
import url from "url";
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
        {unstoredTokens.map((token, index) => (
          <Box sx={{ pt: 1 }}>
            <List >
              <React.Fragment key={index}>
              <ListItem
                button
                onClick={() => handleAddAccount(token.name)}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <ListItemAvatar>
                  <Box
                    component="img"
                    src={token.icon_svg}
                    alt={token.name}
                    sx={{ width: "30px", height: "30px", marginRight: 0 }}
                  />
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="body2">{token.name}</Typography>
                </ListItemText>
              </ListItem>
              </React.Fragment>
            </List>
          </Box>
        ))}
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
