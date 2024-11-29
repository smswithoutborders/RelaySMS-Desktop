import React, { useEffect, useRef, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import { executeSelect, handleDekuHelpSelect, handleDekuSettingsSelect, handleSmsMessageSelect } from "../handlers/dekuHandler";
import { HelpOutline, Settings } from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { FaRegComments } from "react-icons/fa6";

function DekuLayout() {
  const { setNavigationPanel, setControlPanel, setDisplayPanel } = useLayout();
  const currentActionRef = useRef(null);

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const navItems = [
    {
      default: true,
      text: "Messages",
      icon: <FaRegComments size="23px" />,
      action: () =>
        handleSmsMessageSelect({
          setControlPanel,
          setDisplayPanel,
          setAlert,
        }),
    },
    {
      text: "Settings",
      icon: <Settings />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handleDekuSettingsSelect,
          setControlPanel,
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
          selectFunction: handleDekuHelpSelect,
          setControlPanel,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
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
