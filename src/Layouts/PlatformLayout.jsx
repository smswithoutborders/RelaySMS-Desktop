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
import {
  Settings,
  Edit,
  Add,
  CellTower,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import DialogView from "../Views/DialogView";

function PlatformLayout() {
  const { setNavigationPanel, setControlPanel, setDisplayPanel } = useLayout();

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleLogoutClick = () => {
    setDisplayPanel(
      <DialogView
        open={true}
        title="Log Out"
        description="Are you sure you want to log out?"
        onClose={() => setDisplayPanel(null)}
        onConfirm={() => {
          setDisplayPanel(null);
          setAlert({
            open: true,
            message: "Logged out successfully!",
            severity: "success",
          });
        }}
      />
    );
  };

  const handleDeleteAccountClick = () => {
    setDisplayPanel(
      <DialogView
        open={true}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        onClose={() => setDisplayPanel(null)}
        onConfirm={() => {
          setDisplayPanel(null);
          setAlert({
            open: true,
            message: "Account deleted!",
            severity: "warning",
          });
        }}
      />
    );
  };

  const navItems = [
    {
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

export default PlatformLayout;
