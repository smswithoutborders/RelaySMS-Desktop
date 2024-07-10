import React, { useState } from "react";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function AddAccounts({ open, onClose }) {
  const { t } = useTranslation();
  const [unstoredTokens, setUnstoredTokens] = useState([
    { platform: "gmail" },
    { platform: "twitter" },
  ]); // Mock data for icons

  const handleAddAccount = async (platform) => {
    try {   
      const response = await window.api.getOAuth2AuthorizationUrl(
        platform,
        "",
        "",
        true,
      );
      console.log("Authorization URL:", response);

        // Call the IPC handler to open external URL
    const success = await window.api.openExternalUrl(response.authorization_url);
    if (!success) {
      console.error("Failed to open external URL.");
    }
  } catch (error) {
    console.error("Failed to get OAuth2 authorization URL:", error);
  }
};

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose} sx={{ my: 10, mx: 5 }}>
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
