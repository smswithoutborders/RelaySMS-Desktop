import {
  Box,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";
import React from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function SecuritySettings() {
  const { t } = useTranslation();
  return (
    <Box sx={{ m: 4, mt: 6 }}>
      <Box sx={{ display: "flex", my: 2, ml: 2 }}>
        <IconButton sx={{ mr: 2 }} component={Link} to="/settings">
          <FaArrowLeft size="20px" />
        </IconButton>
        <Typography variant="h6">{t("settings")}</Typography>
      </Box>
      {/*  */}
      <Box>
        <List>
          <Typography sx={{ pt: 3, ml: 2 }} variant="body2">
            {t("phonelockoptions")}
          </Typography>

          <Grid container>
            <ListItem>
              <Grid item md={8} sm={8}>
                <ListItemText>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {t("enablelock")}
                  </Typography>
                  <Typography variant="body2">{t("securitytext1")}</Typography>
                </ListItemText>
                <Grid item md={3} sm={3}>
                  <Switch />
                </Grid>
              </Grid>
              <Divider />
            </ListItem>
          </Grid>

          <Typography sx={{ pt: 4, ml: 2 }} variant="body2">
            {t("vault")}
          </Typography>
          <ListItem>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("revoke")}
              </Typography>
              <Typography variant="body2">{t("securitytext2")}</Typography>
            </ListItemText>
            <Divider />
          </ListItem>
          <Typography sx={{ pt: 4, ml: 2 }} variant="body2">
            {t("account")}
          </Typography>
          <ListItem>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("logout")}
              </Typography>
              <Typography variant="body2">{t("logouttext")}</Typography>
            </ListItemText>
          </ListItem>
          <ListItem sx={{ pt: 3 }}>
            <ListItemText>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {t("delete")}
              </Typography>
              <Typography variant="body2">{t("deletetext")}</Typography>
            </ListItemText>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
}
