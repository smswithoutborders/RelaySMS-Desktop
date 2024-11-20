import React, { useEffect, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handleDekuComposeSelect,
  handleModemSelect,
  handleDekuSettingsSelect,
  handleMessagesSelect,
} from "../handlers/dekuHandler";
import {
  Settings,
  Edit,
  CellTower,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function DekuLayout() {
  const { setNavigationPanel, setControlPanel, setDisplayPanel } = useLayout();
  const navigate = useNavigate();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  NavigationPanel.defaultProps = {
    app: {
      action: () => console.warn("App action not defined"),
      icon: "",
      text: "Unknown App",
    },
  };

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
        handleDekuComposeSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },

    {
      text: "Modems",
      icon: <CellTower />,
      action: () =>
        handleModemSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },
    {
      text: "Settings",
      icon: <Settings />,
      action: () =>
        handleDekuSettingsSelect({
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
        app={{
          action: () => navigate("/"),
          icon: "logo.png",
          text: "Relay",
        }}
      />
    );
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

export default DekuLayout;
