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
  Divider,
} from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import TelegramCompose from "../Components/ComposeTelegram";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");

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
    setTelegramOpen(false);
    setPopoverAnchor(null);
    onClose();
  };

  const handleTwitterClick = () => {
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
      <Popover
         anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={open}
        onClose={onClose}
        onOpen={() => {}}
      >
        <Box sx={{ py: 3, px: 2, width: 300 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {t("savedPlatforms")}
          </Typography>
          <Divider/>
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
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
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
                    onClick={
                      selectedPlatform === "gmail"
                        ? handleGmailClick
                        : selectedPlatform === "twitter"
                        ? handleTwitterClick
                        : handleTelegramClick
                    }
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
      </Popover>
      <GmailCompose open={composeOpen} onClose={handleCloseCompose} />
      <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter} />
      <TelegramCompose open={telegramOpen} onClose={handleCloseTelegram} />
    </>
  );
}
