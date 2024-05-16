import React, { useState } from "react";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";
import { useTranslation } from "react-i18next";

export default function Compose({ open, onClose }) {
  const { t } = useTranslation();
  const [composeOpen, setComposeOpen] = useState(false);
  const [twitterOpen, setTwitterOpen] = useState(false);

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
          <Grid item md={2} sm={3}>
            <Box onClick={handleTwitterClick}>
              <Box component="img" src="x-twitter.svg" sx={{ width: "30%" }} />
            </Box>
          </Grid>
          <Grid item md={2} sm={3}>
            <Box onClick={handleGmailClick}>
              <Box component="img" src="gmail.svg" sx={{ width: "30%" }} />
            </Box>
          </Grid>
        </Grid>
      </Box>
      <GmailCompose open={composeOpen} onClose={handleCloseCompose} />
      <TwitterCompose open={twitterOpen} onClose={handleCloseTwitter} />
    </Drawer>
  );
}
