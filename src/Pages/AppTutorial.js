import { Alert, Box, List, ListItem, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";

export default function AppTutorial() {
  const {t} = useTranslation();
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
       {t("tutorials.about")}
      </Typography>
      <Typography variant="body2" sx={{ mt: 2 }}>
      {t("tutorials.about info")}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 3 }}>
      {t("tutorials.dependencies/requirements")}
      </Typography>
      <ul>
        <li>{t("tutorials.modem")}</li>
      </ul>
      <Typography variant="body2">
      {t("tutorials.modem info")}
      </Typography>
      <Typography variant="h6" sx={{ fontWeight: 600, mt: 5 }}>
      {t("tutorials.using the app")}
      </Typography>
      <List>
        <ListItem>1. {t("tutorials.save platforms")}</ListItem>
      </List>
      <Typography variant="body2">
      {t("tutorials.save platfrom info")}
      </Typography>
      <Box
        component="img"
        src="images/AddPlatforms.png"
        alt="Adding platforms"
        sx={{ width: "60%" }}
      />
      <List>
        <ListItem>{t("tutorials.select gateway client")}</ListItem>
      </List>
     
      <List>
        <ListItem>{t("tutorials.compose message")}</ListItem>
      </List>
      <Typography variant="body2">
      {t("tutorials.compose message info")}
      </Typography>
      <Alert severity="info" sx={{my: 2}}>
      {t("tutorials.alert")}
      </Alert>
      <Box
        component="img"
        src="images/ComposeMessage.png"
        alt="Composing a message"
        sx={{ width: "60%" }}
      />
    </Box>
  );
}
