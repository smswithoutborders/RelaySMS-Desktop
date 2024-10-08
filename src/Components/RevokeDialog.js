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
} from "@mui/material";
import { useState } from "react";

export default function RevokeDialog() {
  const { t } = useTranslation();
  const [tokens, setTokens] = useState([]);
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
    } catch (error) {
      console.error("Failed to fetch stored tokens:", error);
      setAlert({
        message: error.message,
        severity: "error",
        open: true,
      });
    }
  };

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
    <Box sx={{ py: 4, px: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {t("savedAccounts")}
      </Typography>
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
                    token.platform === "gmail" ? "gmail.svg" : "x-twitter.svg"
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
