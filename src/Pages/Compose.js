import React, { useState } from "react";
import { Drawer, Grid, Box, Typography } from "@mui/material";
import GmailCompose from "../Components/ComposeGmail";
import TwitterCompose from "../Components/ComposeTwitter";

export default function Compose({ open, onClose }) {
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
        <Typography variant="h6">Saved Platforms</Typography>
        <Typography variant="body1">
          These are platforms stored in your "Vault" and can be used when you
          are offline.
        </Typography>
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
