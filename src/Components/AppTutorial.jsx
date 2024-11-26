import { Box, List, ListItem, Typography } from "@mui/material";
import React from "react";

export default function AppTutorial() {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
        About
      </Typography>
      <Typography variant="body2" sx={{mt:2}}>
        RelaySMS (also known as swob, short for SMSWithoutBorders) is a tool
        that lets you send secure online messages via SMS without needing an
        internet connection.
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
        Dependencies/ Requirements
      </Typography>
      <ul>
        <li> A modem or an active sim card in your computer</li>
      </ul>
      <Typography variant="body2">
        This is very important for sending SMS using RelaySMS Desktop. Without a
        modem or sim you cannot send SMS.
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
        Using the app
      </Typography>
      <List>
        <ListItem>1. Save Platforms</ListItem>
      </List>
      <Typography variant="body2">
        Select the platforms tab, click the add button in the platfom you wish
        to save, this will open the auth screen and one.
      </Typography>
      <Box
        component="img"
        src="platform.png"
        alt="platforms"
        sx={{ width: "60%" }}
      />
      <List>
        <ListItem>2. Select Gateway Client</ListItem>
      </List>
      <Typography variant="body2">
        Select the platforms tab, click the add button in the platfom you wish
        to save, this will open the auth screen and one.
      </Typography>
      <Box
        component="img"
        src="gatewayclient.png"
        alt="gateway"
        sx={{ width: "60%" }}
      />
      <List>
        <ListItem>3. Compose Message</ListItem>
      </List>
      <Typography variant="body2">
        Select the platforms tab, click the add button in the platfom you wish
        to save, this will open the auth screen and one.
      </Typography>
      <Box
        component="img"
        src="composemessage.png"
        alt="compose"
        sx={{ width: "60%" }}
      />
    </Box>
  );
}
