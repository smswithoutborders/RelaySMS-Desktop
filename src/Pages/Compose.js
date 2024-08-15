import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Popover,
  ListItem,
  ListItemText,
  List,
  ListItemAvatar,
} from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import TelegramCompose from "../Components/ComposeTelegram";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose, asPopover, anchorEl }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);

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
      await window.api.storeParams("storedTokens", response.stored_tokens);
    } catch (error) {
      console.error("Failed to fetch stored tokens:", error);

      try {
        const storedTokens = await window.api.retrieveParams("storedTokens");
        setTokens(storedTokens || []);
        setAlert({
          message: "Using locally stored tokens due to an error.",
          severity: "warning",
          open: true,
        });
      } catch (localError) {
        console.error("Failed to retrieve stored tokens locally:", localError);
        setAlert({
          message: error.message,
          severity: "error",
          open: true,
        });
      }
    }
  };

  useEffect(() => {
    if (open) {
      fetchStoredTokens();
    }
  }, [open]);

  const handleGmailClick = (token) => {
    setSelectedToken(token.account_identifier);
    setComposeOpen(true);
    setTwitterOpen(false);
    setTelegramOpen(false);
    setPopoverAnchor(null);
  };

  const handleTwitterClick = (token) => {
    setSelectedToken(token.account_identifier);
    setTwitterOpen(true);
    setComposeOpen(false);
    setTelegramOpen(false);
    setPopoverAnchor(null);
  };

  const handleTelegramClick = () => {
    setTelegramOpen(true);
    setComposeOpen(false);
    setTwitterOpen(false);
    setPopoverAnchor(null);
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
  };

  const handleCloseTwitter = () => {
    setTwitterOpen(false);
  };

  const handleCloseTelegram = () => {
    setTelegramOpen(false);
  };

  const handlePlatformClick = (event, platform) => {
    setPopoverAnchor(event.currentTarget);
    setSelectedPlatform(platform);
  };

  const handlePopoverClose = () => {
    setPopoverAnchor(null);
  };

  const filteredTokens = tokens.filter(
    (token) => token.platform === selectedPlatform
  );

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
      <Box sx={{ py: 3, px: 2 }} onClick={fetchStoredTokens}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t("savedPlatforms")}
        </Typography>
        <Typography variant="body2" sx={{ pt: 3 }}>
          {t("selectPlatform")}
        </Typography>
        <Box sx={{ pt: 1 }}>
          <List>
            {["gmail", "twitter", "telegram"].map((platform) => (
              <React.Fragment key={platform}>
                <ListItem
                  button
                  onClick={(event) => handlePlatformClick(event, platform)}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemAvatar>
                    <Box
                      component="img"
                      src={
                        platform === "gmail"
                          ? "gmail.svg"
                          : platform === "twitter"
                          ? "twitter.svg"
                          : "telegram.svg"
                      }
                      sx={{ width: "30px", height: "30px", marginRight: 2 }}
                    />
                  </ListItemAvatar>
                  <ListItemText>
                    <Typography variant="body2" sx={{ textTransform: "none" }}>
                      {platform}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      </Box>
      <Popover
        open={Boolean(popoverAnchor)}
        anchorEl={popoverAnchor}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2 }}>
          {filteredTokens.length === 0 ? (
            <Typography variant="body2">{t("noStoredAccounts")}</Typography>
          ) : (
            filteredTokens.map((token, index) => (
              <List key={index}>
                <ListItem
                  button
                  onClick={() => {
                    if (selectedPlatform === "gmail") {
                      handleGmailClick(token);
                    } else if (selectedPlatform === "twitter") {
                      handleTwitterClick(token);
                    } else if (selectedPlatform === "telegram") {
                      handleTelegramClick();
                    }
                  }}
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <ListItemText>
                    <Typography variant="body2" sx={{ cursor: "pointer" }}>
                      {token.account_identifier}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </List>
            ))
          )}
        </Box>
      </Popover>
      <GmailCompose
        open={composeOpen}
        onClose={handleCloseCompose}
        accountIdentifier={selectedToken}
      />
      <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter}  accountIdentifier={selectedToken}/>
      <TelegramCompose open={telegramOpen} onClose={handleCloseTelegram} />
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
