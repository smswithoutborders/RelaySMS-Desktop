import React, { useState, useEffect } from "react";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import nacl from "tweetnacl";
import {
  encode as encodeBase64,
  decode as decodeBase64,
} from "base64-arraybuffer";
import { createHash } from "crypto-browserify";
import { createDecipheriv } from "crypto-browserify";

export default function AddAccounts({ open, onClose }) {
  const { t } = useTranslation();
  const [unstoredTokens, setUnstoredTokens] = useState([
    { platform: "gmail" },
    { platform: "twitter" },
  ]);

  const openOAuthScreen = async (
    oauthUrl,
    expectedRedirect,
    clientID,
    scope
  ) => {
    try {
      const newUrl = await window.api.openOauth({
        oauthUrl,
        expectedRedirect,
        clientID,
        scope,
      });
      console.log("Received OAuth2 redirection URL:", newUrl);
      handleMessage(newUrl);
    } catch (error) {
      console.error("Error opening OAuth screen:", error);
      // Handle error, e.g., show a message to the user
    }
  };

  const handleMessage = (url) => {
    // Your logic to handle the URL goes here
    console.log("Handling URL:", url);
    // Parse the URL to extract the authorization code or token
    const parsedUrl = new URL(url);
    const authCode = parsedUrl.searchParams.get("code");
    console.log("Authorization Code:", authCode);
  };

  const handleAddAccount = async (platform) => {
    try {
      const response = await window.api.getOAuth2AuthorizationUrl(
        platform,
        "",
        "",
        false
      );
      openOAuthScreen(
        response.authorization_url,
        response.redirect_url,
        response.client_id,
        response.scope.split(",")
      );
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

// Helper function to extract the code from the URL
function extractCodeFromUrl(url) {
  const urlObj = new URL(url);
  const params = new URLSearchParams(urlObj.search);
  return params.get("code");
}

// Function to derive the key
function deriveKey(sharedSecret) {
  const hash = createHash("sha256");
  hash.update(sharedSecret);
  return hash.digest().slice(0, 32); // Fernet uses 256-bit keys
}

// Function to decrypt the token
function decryptFernet(key, token) {
  const keyBuffer = Buffer.from(key, "base64");
  const tokenBuffer = Buffer.from(token, "base64");

  const iv = tokenBuffer.slice(1, 17); // Initialization vector
  const ciphertext = tokenBuffer.slice(17, -32); // Ciphertext
  const hmac = tokenBuffer.slice(-32); // HMAC

  const decipher = createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(ciphertext, "binary", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Function to run the next process after token exchange
function runNextProcess(response) {
  // Add your next process logic here
  console.log("Running next process with response:", response);
}
