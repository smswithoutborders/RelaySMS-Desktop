import React, { useEffect, useState, useRef } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handleBridgeComposeSelect,
  handleGatewayClientSelect,
  handleBridgeSettingsSelect,
  handleBridgeMessageSelect,
  executeSelect,
} from "../handlers/bridgeHandlers";
import {
  Settings,
  Edit,
  Wallet,
  CellTower,
  HelpOutline,
} from "@mui/icons-material";
import { Snackbar, Alert } from "@mui/material";
import { FaRegComments } from "react-icons/fa6";

function BridgeLayout() {
  const currentActionRef = useRef(null);
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
      icon: <FaRegComments size="23px" />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handleBridgeMessageSelect,
          setControlPanel,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
    },
    {
      text: "Compose",
      icon: <Edit />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handleBridgeComposeSelect,
          setControlPanel,
          setDisplayPanel,
          setAlert,
          currentActionRef,
        }),
    },
    {
      text: "Gateway Clients",
      icon: <CellTower />,
      action: (action) =>
        executeSelect({
          actionName: action,
          selectFunction: handleGatewayClientSelect,
          setControlPanel,
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
          selectFunction: handleBridgeSettingsSelect,
          setControlPanel,
          setDisplayPanel,
          setAlert,
          currentActionRef,
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

export default BridgeLayout;
