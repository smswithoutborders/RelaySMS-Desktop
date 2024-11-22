import React, { useEffect, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handleDekuComposeSelect,
  handleModemSelect,
  handleDekuSettingsSelect,
  handleSmsMessageSelect,
} from "../handlers/dekuHandler";
import { Settings, Edit, CellTower, HelpOutline } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { FaRegComments } from "react-icons/fa6";

function DekuLayout() {
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
      icon: <FaRegComments size="23px"/>,
      action: () =>
        handleSmsMessageSelect({
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

export default DekuLayout;
