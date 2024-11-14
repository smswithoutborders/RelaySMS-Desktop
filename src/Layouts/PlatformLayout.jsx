import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../Contexts/LayoutContext";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import ServiceList from "../Components/ServiceList";
import MessageList from "../Components/MessageList";
import {
  handlePlatformMessageClick,
  handlePlatformComposeSelect,
  handleGatewayClientSelect,
  handlePlatformSettingsSelect,
} from "../handlers/platformHandlers";
import {
  Settings,
  Edit,
  Add,
  CellTower,
  Language,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import ItemsList from "../Components/ItemsList";
import CustomDialog from "../Components/CustomDialog";

function PlatformLayout() {
  const { setNavigationPanel, setControlPanel, setDisplayPanel } =
    useContext(LayoutContext);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const languages = [
    { name: "English" },
    { name: "French" },
    { name: "Persian" },
    { name: "Spanish" },
    { name: "Turkish" },
  ];

  const messages = [
    {
      avatar: "./gmail.png",
      title: "System Update",
      text: "Your system update was successful.",
      date: "2024-11-13",
    },
    {
      avatar: "./gmail.png",
      title: "Meeting Reminder",
      text: "Don't forget the meeting at 3 PM.",
      date: "2024-11-12",
    },
    {
      avatar: "./gmail.png",
      title: "Welcome Message",
      text: "Welcome to the platform! Let us know if you need help.",
      date: "2024-11-10",
    },
  ];

  const handleLogoutClick = () => {
    setDisplayPanel(
      <CustomDialog
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
      <CustomDialog
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
      action: () => {
        setDisplayPanel(null);
        setControlPanel(
          <ControlPanel
            title="Messages"
            element={
              <MessageList
                messages={messages}
                onClick={(message) =>
                  handlePlatformMessageClick(setDisplayPanel, message)
                }
              />
            }
          />
        );
      },
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
      action: () => {
        setDisplayPanel(null);
        setControlPanel(
          <ControlPanel title="Add Accounts" element={<ServiceList />} />
        );
      },
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
    </>
  );
}

export default PlatformLayout;
