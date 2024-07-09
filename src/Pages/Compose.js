import React, { useState, useEffect } from "react";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    const fetchStoredTokens = async () => {
      try {
        const longLivedToken = await window.api.retrieveParams("longLivedToken");
        const response = await window.api.listEntityStoredTokens(longLivedToken);
        setTokens(response.stored_tokens);
      } catch (error) {
        console.error("Failed to fetch stored tokens:", error);
      }
    };

    fetchStoredTokens();
  }, []);

  const handleGmailClick = () => {
    setComposeOpen(true);
    setTwitterOpen(false);
  };

  const handleTwitterClick = () => {
    setTwitterOpen(true);
    setComposeOpen(false);
  };

  const handleCloseCompose = () => {
    setComposeOpen(false);
  };

  const handleCloseTwitter = () => {
    setTwitterOpen(false);
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      sx={{ my: 10, mx: 5 }}
    >
      <Box sx={{ py: 8, px: 5 }}>
        <Typography variant="h6">{t("savedPlatforms")}</Typography>
        <Typography variant="body1">{t("savedPlatforms1")}</Typography>
        <Grid container sx={{ pt: 5 }}>
          {tokens.map((token, index) => (
            <Grid item md={2} sm={3} key={index}>
              <Box onClick={token.platform === "gmail" ? handleGmailClick : handleTwitterClick}>
                <Box
                  component="img"
                  src={token.platform === "gmail" ? "gmail.svg" : "x-twitter.svg"}
                  sx={{ width: "30%" }}
                />
              </Box>
              <Typography variant="body2">{token.account_identifier}</Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <GmailCompose open={composeOpen} onClose={handleCloseCompose} />
      <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter} />
    </Drawer>
  );
}
