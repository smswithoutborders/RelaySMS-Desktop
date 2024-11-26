import { Alert, Box, List, ListItem, Typography } from "@mui/material";
import React from "react";

export default function AppTutorial() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
        About
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
        RelaySMS (also known as SWoB, short for SMS Without Borders) is a tool
        that allows you to send secure online messages via SMS without requiring
        an internet connection.
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
        Dependencies/Requirements
      </Typography>
      <ul>
        <li>A modem or an active SIM card in your computer</li>
      </ul>
      <Typography variant="body2">
        This is essential for sending SMS using RelaySMS Desktop. Without a
        modem or SIM card, you cannot send SMS.
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
        Using the App
      </Typography>
      <List>
        <ListItem>1. Save Platforms</ListItem>
      </List>
      <Typography variant="body2">
        Navigate to the "Platforms" tab and click the "Add" button for the
        platform you want to save. This will open the authentication screen.
      </Typography>
      <Box
        component="img"
        src="AddPlatforms.png"
        alt="Adding platforms"
        sx={{ width: "60%" }}
      />
      <List>
        <ListItem>2. Select Gateway Client</ListItem>
      </List>
      <Typography variant="body2">
        Go to the "Gateway Clients" tab and select the gateway client (number)
        closest to your location to minimize SMS costs.
      </Typography>
      <Box
        component="img"
        src="SelectGatewayClient.png"
        alt="Selecting gateway client"
        sx={{ width: "60%" }}
      />
      <List>
        <ListItem>3. Compose Message</ListItem>
      </List>
      <Typography variant="body2">
        Open the "Compose" tab, select the platform you want to publish to, and
        that's it! You've sent your first message using RelaySMS.
      </Typography>
      <Alert severity="info" sx={{my: 2}}>
        Ensure you have an active modem or SIM card in your computer to
        successfully send SMS.
      </Alert>
      <Box
        component="img"
        src="ComposeMessage.png"
        alt="Composing a message"
        sx={{ width: "60%" }}
      />
    </Box>
  );
}
