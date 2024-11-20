import React, { useEffect, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handlePlatformComposeSelect,
  handleGatewayClientSelect,
  handlePlatformSettingsSelect,
  handleAddAccountSelect,
  handleMessagesSelect,
} from "../handlers/platformHandlers";
import { listEntityStoredTokens } from "../controllers/platformControllers";
import {
  Settings,
  Edit,
  Add,
  CellTower,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";

function PlatformLayout() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const { setNavigationPanel, setControlPanel, setDisplayPanel } = useLayout();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navItems = [
    {
      default: true,
      text: "Messages",
      icon: <Message />,
      action: () =>
        handleMessagesSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },
    {
      text: "Compose",
      icon: <Edit />,
      action: () =>
        handlePlatformComposeSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
          setLoading,
          loading,
        }),
    },
    {
      text: "Add Accounts",
      icon: <Add />,
      action: () =>
        handleAddAccountSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },
    {
      text: "Gateway Clients",
      icon: <CellTower />,
      action: () =>
        handleGatewayClientSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },
    {
      text: "Settings",
      icon: <Settings />,
      action: () =>
        handlePlatformSettingsSelect({
          setControlPanel,
          setDisplayPanel,
        }),
    },
    {
      text: "Help",
      icon: <HelpOutline />,
      action: () => {
        setDisplayPanel(null);
        setControlPanel(
          <ControlPanel
            title="Help"
            element={<div>Welcome to the Help Page</div>}
          />
        );
      },
    },
  ];

  useEffect(() => {
    setNavigationPanel(
      <NavigationPanel
        items={navItems}
        // app={{
        //   action: () => navigate("/deku"),
        //   icon: "Deku.png",
        //   text: "Deku",
        // }}
      />
    );

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
            Refreshing your stored token list...
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

    // fetchTokens();
  }, []);

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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
