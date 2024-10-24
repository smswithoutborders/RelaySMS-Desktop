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
  Skeleton,
  Grid,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import TelegramCompose from "../Components/ComposeTelegram";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose, asPopover, anchorEl, onLogoutSuccess}) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [telegramOpen, setTelegramOpen] = useState(false);
  const [tokens, setTokens] = useState([]);
  const [alert, setAlert] = useState({ message: "", severity: "" });
  const [popoverAnchor, setPopoverAnchor] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [selectedToken, setSelectedToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpired, setSessionExpired] = useState(false);

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
      console.error("Error fetching tokens from server:", error);

      if (
        error.message &&
        error.message.includes("The long-lived token is invalid")
      ) {
        setAlert({
          message: "Your session has expired. Please log in again.",
          severity: "error",
          open: true,
        });
        setSessionExpired(true);
        return; 
      }

      try {
        const storedTokens = await window.api.retrieveParams("storedTokens");
        if (storedTokens && storedTokens.length > 0) {
          setTokens(storedTokens);
          setAlert({
            message: "Using locally stored tokens due to a server error.",
            severity: "warning",
            open: true,
          });
        } else {
          throw new Error("No locally stored tokens available.");
        }
      } catch (localError) {
        console.error("Failed to retrieve locally stored tokens:", localError);
        setAlert({
          message: "Failed to fetch tokens. Please try again later.",
          severity: "error",
          open: true,
        });
      }
    } finally {
      setLoading(false); 
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

  const handleTelegramClick = (token) => {
    setSelectedToken(token.account_identifier);
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

  const handleLogout = async () => {
    try {
      await window.api.logout(); 
      setAlert({
        message: "Logged out successfully",
        severity: "success",
        open: true,
      });
      onLogoutSuccess(); 
      setSessionExpired(false); 
  
      setTimeout(() => {
        onClose(); 
      }, 2000); 
    } catch (error) {
      console.error("Failed to logout:", error);
      setAlert({
        message: "Logout failed. Please try again.",
        severity: "error",
        open: true,
      });
    }
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
      {/*  */}
      {sessionExpired && (
      <Dialog
         open={open}
         onClose={() => {}} 
         disableEscapeKeyDown 
         disablePortal={true} 
         disableScrollLock={true} 
         BackdropProps={{
           style: { pointerEvents: "none" }, 
         }}
      >
        <DialogTitle>{t("sessionExpiredTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>{t("sessionExpiredBody")}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLogout} color="primary">
            {t("OK")}
          </Button>
        </DialogActions>
      </Dialog>
      )}
      {/*  */}
      <Box sx={{ py: 2, px: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          {t("compose")}
        </Typography>
        <Typography variant="body2" sx={{ pt: 3 }}>
          {t("selectPlatform")}
        </Typography>
        <Box sx={{ pt: 1 }}>
          <List>
            {["gmail", "twitter", "telegram"].map((platform) => (
              <React.Fragment key={platform}>
                {loading ? (
                  <Box>
                    <Grid container>
                      <Grid item md={3} sm={3} sx={{ mb: 3 }}>
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
                  <ListItem
                    button
                    onClick={(event) => handlePlatformClick(event, platform)}
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "white" }}>
                        <Box
                          component="img"
                          src={
                            platform === "gmail"
                              ? "gmail.svg"
                              : platform === "twitter"
                              ? "twitter.svg"
                              : "telegram.svg"
                          }
                          sx={{ width: "30px", height: "30px", marginRight: 0 }}
                        />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText>
                      <Typography
                        variant="body2"
                        sx={{ textTransform: "none" }}
                      >
                        {platform}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                )}
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
          {loading ? (
            <Skeleton variant="rectangular" width={300} height={40} />
          ) : filteredTokens.length === 0 ? (
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
                      handleTelegramClick(token);
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
      <TwitterCompose
        open={twitterOpen}
        onClose={handleCloseTwitter}
        accountIdentifier={selectedToken}
      />
      <TelegramCompose
        open={telegramOpen}
        onClose={handleCloseTelegram}
        accountIdentifier={selectedToken}
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
