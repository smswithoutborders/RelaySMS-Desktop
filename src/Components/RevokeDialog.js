import { useTranslation } from "react-i18next";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Snackbar,
  Alert,
  Paper,
  Skeleton,
  Avatar,
} from "@mui/material";
import { useEffect, useState } from "react";

export default function RevokeDialog() {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  const fetchStoredTokens = async () => {
    try {
      const [longLivedToken, serverDevicePublicId, clientDeviceSecretId] =
        await Promise.all([
          window.api.retrieveParams("longLivedToken"),
          window.api.retrieveParams("serverDeviceId"),
          window.api.retrieveParams("client_device_id_key_pair"),
        ]);

      const longLT = await window.api.retrieveLongLivedToken({
        client_device_id_secret_key: clientDeviceSecretId.secretKey,
        server_device_id_pub_key: serverDevicePublicId,
        long_lived_token_cipher: longLivedToken,
      });

      const response = await window.api.listEntityStoredTokens(longLT);
      setTokens(response.stored_tokens);
      console.log("response:", response);
      setLoading(false);
    } catch (error) {
      try {
        const storedTokens = await window.api.retrieveParams("storedTokens");
        setTokens(storedTokens || []);
        setAlert({
          message: "Using locally stored tokens due to network error.",
          severity: "warning",
          open: true,
        });
      } catch (localError) {
        console.error("Failed to retrieve stored tokens locally:", localError);
        setAlert({
          message: localError.message || "Failed to retrieve stored tokens.",
          severity: "error",
          open: true,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchStoredTokens();
  }, []);

  const handleTokenRevoke = async (platform, accountIdentifier) => {
    try {
      const [longLivedToken, serverDevicePublicId, clientDeviceSecretId] =
        await Promise.all([
          window.api.retrieveParams("longLivedToken"),
          window.api.retrieveParams("serverDeviceId"),
          window.api.retrieveParams("client_device_id_key_pair"),
        ]);

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

  return (
    <Box sx={{ p: 3 }}>
      <List component={Paper} sx={{ p: 3 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, pb: 2 }}>
          {t("revoke")}
        </Typography>
        {loading
          ? Array.from(new Array(3)).map((_, index) => (
              <List key={index}>
                <ListItem>
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ marginRight: 2 }}
                  />
                  <Skeleton variant="text" width="80%" height={40} />
                </ListItem>
              </List>
            ))
          : tokens.map((token, index) => (
              <List key={index}>
                <ListItem
                  button
                  sx={{ display: "flex", alignItems: "center" }}
                  onClick={() =>
                    handleTokenRevoke(token.platform, token.account_identifier)
                  }
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "white" }}>
                      <Box
                        component="img"
                        src={
                          token.platform === "gmail"
                            ? "gmail.svg"
                            : token.platform === "twitter"
                              ? "twitter.svg"
                              : "telegram.svg"
                        }
                        sx={{ width: "30px", height: "30px", marginRight: 0 }}
                      />
                    </Avatar>
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
    </Box>
  );
}
