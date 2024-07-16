import React, { useState, useEffect } from "react";
import url from "url";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import decryptLongLivedToken from "../Cryptography"

export default function AddAccounts({ open, onClose, DecryptedLLT }) {
  const { t } = useTranslation();
  const [unstoredTokens, setUnstoredTokens] = useState([
    { platform: "gmail" },
    { platform: "twitter" },
  ]);

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

  // Retrieve the long-lived token and device IDs
  const longLivedToken = await window.api.retrieveParams("longLivedToken");
  const serverDeviceId = await window.api.retrieveParams("serverDeviceId");
  const clientDeviceId = await window.api.retrieveParams("client_device_id_pub_key");

  // Decrypt the long-lived token
  const decryptedLLT = decryptLongLivedToken(longLivedToken, serverDeviceId, clientDeviceId);

      const store = await window.api.exchangeOAuth2CodeAndStore(
        decryptedLLT,
        platform,
        auth_code,
        response.code_verifier       
      );
      console.log(store);
    } catch (error) {
      console.error("Failed to get OAuth2 authorization URL:", error);
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ my: 10, mx: 5 }}
    >
      <Box sx={{ py: 8, px: 5 }}>
        <Typography variant="h6">Add Accounts</Typography>
        <Typography variant="body1">Adding accounts blah blah blah</Typography>
        <Grid container sx={{ pt: 5 }}>
          {unstoredTokens.map((token, index) => (
            <Grid item md={2} sm={3} key={index}>
              <Box onClick={() => handleAddAccount(token.platform)}>
                <img
                  src={`/${token.platform}.svg`} // Adjust path as per your project structure
                  alt={token.platform}
                  style={{ width: "30%", cursor: "pointer" }}
                />
              </Box>
              <Typography variant="body2">{token.platform}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Drawer>
  );
}
