import React, { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export default function SecuritySettings({
  handleRevokeTokensClick,
  handleDeleteClick,
  handleLogoutClick
}) {
  const { t } = useTranslation();
  const [alert, setAlert] = useState({
    message: "",
    severity: "",
    open: false,
  });

  const handleAlertClose = () => {
    setAlert({ ...alert, open: false });
  };

  return (
    <Box>
      <Box>
        <Box sx={{ px: 1, py: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, ml: 2 }}>
            {t("menuItems")}
          </Typography>
          <List sx={{ pt: 1 }}>
            <ListItem button onClick={handleRevokeTokensClick}>
              <ListItemText>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("revoke")}
                </Typography>
              </ListItemText>
            </ListItem>

            {/* <ListItem button onClick={openResetPasswordDialog}>
              <ListItemText>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("resetPassword")}
                </Typography>
              </ListItemText>
            </ListItem> */}
            <ListItem button onClick={handleLogoutClick}>
              <ListItemText>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("logout")}
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem button onClick={handleDeleteClick}>
              <ListItemText>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {t("delete")}
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </Box>
      </Box>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleAlertClose}
      >
        <Alert
          onClose={handleAlertClose}
          severity={alert.severity}
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
