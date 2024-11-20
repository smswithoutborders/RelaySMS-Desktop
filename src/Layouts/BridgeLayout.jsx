import React, { useEffect, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handleBridgeComposeSelect,
  handleGatewayClientSelect,
  handleBridgeSettingsSelect,
  handleMessagesSelect,
} from "../handlers/bridgeHandlers";
import {
  Settings,
  Edit,
  CellTower,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";

function BridgeLayout() {
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
        handleBridgeComposeSelect({
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
        handleBridgeSettingsSelect({
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
    setNavigationPanel(<NavigationPanel items={navItems} />);
  }, []);

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
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

export default BridgeLayout;
