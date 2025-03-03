import React, { useEffect, useState, useRef } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import {
  handlePlatformSettingsSelect,
  handlePlatformHelpSelect,
  handlePlatformSelect,
  executeSelect,
} from "../handlers/platformHandlers";
import { listEntityStoredTokens } from "../controllers/platformControllers";
import {
  Settings,
  Wallet,
  HelpOutline,
  People,
} from "@mui/icons-material";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useTranslation } from "react-i18next";

function PlatformLayout() {
  const currentActionRef = useRef(null);
  const { setNavigationPanel, setDisplayPanel } = useLayout();
  const { t } = useTranslation();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navItems = [
    {
      text: "Accounts",
      icon: <People />,
      className: "platform-step",
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handlePlatformSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
    },
    
    {
      text: "Settings",
      icon: <Settings />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handlePlatformSettingsSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
    },
    {
      text: "Help",
      icon: <HelpOutline />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handlePlatformHelpSelect,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
    },
  ];

  useEffect(() => {
    setNavigationPanel(<NavigationPanel items={navItems} />);

    const fetchTokens = async () => {
      setAlert({
        open: true,
        message: (
          <div style={{ display: "flex", alignItems: "center" }}>
            <CircularProgress
              size={24}
              color="inherit"
              style={{ marginRight: 8 }}
            />
            {t("common.refreshingTokens")}
          </div>
        ),
        severity: "info",
      });

      const { err, res } = await listEntityStoredTokens();

      if (err) {
        setAlert({
          open: true,
          message: err,
          severity: "error",
        });
      } else {
        setAlert({
          open: true,
          message: res.warn || res.message,
          severity: res.warn ? "warning" : "success",
        });
      }
    };

    fetchTokens();
  }, []);

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={8000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{ maxWidth: 700 }}
      >
        <Alert
          onClose={() => setAlert({ ...alert, open: false })}
          severity={alert.severity}
        >
          {alert.message}
        </Alert>
      </Snackbar>
      <BaseLayout />
    </>
  );
}

export default PlatformLayout;
