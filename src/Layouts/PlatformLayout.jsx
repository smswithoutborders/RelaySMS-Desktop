import React, { useEffect, useState } from "react";
import { useLayout } from "../Contexts/LayoutContext";
import BaseLayout from "./BaseLayout";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import {
  handlePlatformComposeSelect,
  handleGatewayClientSelect,
  handlePlatformSettingsSelect,
  handlePlatformSelect,
  handlePlatformMessageSelect,
} from "../handlers/platformHandlers";
import { listEntityStoredTokens } from "../controllers/platformControllers";
import {
  Settings,
  Edit,
  Wallet,
  CellTower,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Snackbar, Alert, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaRegComments } from "react-icons/fa6";

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
      icon: <FaRegComments size="23px" />,
      action: () =>
        handlePlatformMessageSelect({
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
      text: "Platforms",
      icon: <Wallet />,
      action: () =>
        handlePlatformSelect({
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

    fetchTokens();
  }, []);

  return (
    <>
      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
