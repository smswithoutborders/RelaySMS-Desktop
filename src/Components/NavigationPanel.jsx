import React, { useState, useEffect } from "react";
import ReactJoyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

function NavigationPanel({ items = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [activeItem, setActiveItem] = useState(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (items.length > 0) {
      const defaultItem = items.find((item) => item.default);
      if (defaultItem && defaultItem.action) {
        defaultItem.action(defaultItem.text);
      }
    }
  }, [items]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
  };

  const handleItemClick = (item) => {
    setActiveItem(item.text);
    if (item.action) item.action(item.text);
  };

  const isActive = (path) => location.pathname === path;

  //Joyride (Tutorial) config
  const [joyrideState, setJoyrideState] = useState({
    run: false,
    stepIndex: 0,
    steps: [
      {
        target: ".platform-step",
        content:
          t("common.platform-step"),
      },
      {
        target: ".gateway-step",
        content:
        t("common.gateway-step"),
      },
      {
        target: ".compose-step",
        content:
        t("common.compose-step"),
        showNextButton: false,
        showSkipButton: false,
      },
    ],
  });

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenTour");

    if (!hasSeenTour) {
      setIsFirstTimeUser(true);
      setJoyrideState((prevState) => ({
        ...prevState,
        run: true,
      }));
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;

    if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      setJoyrideState((prevState) => ({
        ...prevState,
        stepIndex: action === ACTIONS.PREV ? index - 1 : index + 1,
      }));
    }

    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      setJoyrideState((prevState) => ({
        ...prevState,
        run: false,
      }));
      localStorage.setItem("hasSeenTour", "true");
      setIsFirstTimeUser(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <ReactJoyride
        steps={joyrideState.steps}
        run={joyrideState.run}
        stepIndex={joyrideState.stepIndex}
        continuous={true}
        scrollToFirstStep={true}
        showProgress={true}
        showSkipButton={true}
        disableOverlayClose={true}
        callback={handleJoyrideCallback}
        locale={{
          back: t("ui.back"),
          close: t("ui.close"),
          last: t("ui.last"),
          next: t("ui.next"),
          skip: t("ui.skip"),
        }}
        styles={{
          options: {
            arrowColor: "#fff",
            backgroundColor: "#fff",
            primaryColor: "#007BFF",
            textColor: "#333",
            spotlightShadow: "0 0 0 2px rgba(0, 123, 255, 0.5)",
          },
          buttonClose: {
            color: "#007BFF",
          },
          buttonNext: {
            backgroundColor: "#007BFF",
            color: "#fff",
          },
          buttonBack: {
            color: "#007BFF",
          },
          buttonSkip: {
            color: "#007BFF",
          },
        }}
      />

      <Box
        sx={{
          width: 72,
          mx: "auto",
          flexDirection: "column",
          mt: 2,
          padding: 1,
          zIndex: 1,
        }}
      >
        <Tooltip title={t("ui.relaysms")} placement="right">
          <Link to="/">
            <ListItemButton>
              <ListItemIcon>
                <Box
                  component="img"
                  src="images/icon.png"
                  alt="Relay"
                  sx={{
                    border: isActive("/") ? "2px solid #0C4B94" : "none",
                    boxShadow: isActive("/")
                      ? "0 0 8px 2px rgba(0, 0, 255, 0.6)"
                      : "none",
                    transition: "box-shadow 0.3s ease, border 0.3s ease",
                    width: "33px",
                    p: 0.3,
                    borderRadius: 1,
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
          </Link>
        </Tooltip>
        <Tooltip title={t("ui.deku")} placement="right">
          <Link to="/deku">
            <ListItemButton>
              <ListItemIcon>
                <Box
                  component="img"
                  src="images/Deku.png"
                  alt="Deku"
                  sx={{
                    border: isActive("/deku") ? "2px solid #0C4B94" : "none",
                    boxShadow: isActive("/deku")
                      ? "0 0 8px 2px rgba(0, 0, 255, 0.6)"
                      : "none",
                    transition: "box-shadow 0.3s ease, border 0.3s ease",
                    width: "33px",
                    p: 0.3,
                    borderRadius: 1,
                  }}
                />
              </ListItemIcon>
            </ListItemButton>
          </Link>
        </Tooltip>
      </Box>
      <Divider orientation="vertical" />

      <Box
        variant="permanent"
        sx={{
          flexShrink: 0,
          width: isExpanded ? 240 : 72,
          transition: "width 0.5s ease",
          "& .MuiDrawer-paper": {
            width: isExpanded ? 240 : 72,
            transition: "width 0.5s ease",
            overflowX: "hidden",
          },
        }}
      >
        <List>
          <ListItemButton
            onClick={handleToggle}
            sx={{
              display: "flex",
              justifyContent: isExpanded ? "flex-end" : "center",
              transition: "justify-content 0.5s ease",
            }}
          >
            <IconButton>
              {isExpanded ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
          </ListItemButton>

          <Divider />

          {items.length > 0
            ? items.map((item, index) => (
                <Tooltip
                  title={
                    !isExpanded && item.text
                      ? t(`navigation.${item.text.toLowerCase()}`)
                      : ""
                  }
                  placement="right"
                  key={index}
                >
                  <ListItemButton
                    onClick={() => handleItemClick(item)}
                    className={
                      item.text === "Platforms"
                        ? "platform-step"
                        : item.text === "Gateway Clients"
                        ? "gateway-step"
                        : item.text === "Compose"
                        ? "compose-step"
                        : ""
                    }
                    sx={{
                      padding: "10px 20px",
                      cursor: "pointer",
                      backgroundColor:
                        activeItem === item.text
                          ? "background.default"
                          : "transparent",
                      transition: "background-color 0.3s ease",
                    }}
                  >
                    {item.icon ? (
                      <ListItemIcon>{item.icon}</ListItemIcon>
                    ) : (
                      <Skeleton variant="circular" width={24} height={24} />
                    )}
                    <ListItemText
                      primary={t(`navigation.${item.text.toLowerCase()}`)}
                      sx={{
                        opacity: isExpanded ? 1 : 0,
                        transition: "opacity 0.5s ease, visibility 0.5s ease",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                      }}
                    />
                  </ListItemButton>
                </Tooltip>
              ))
            : Array.from({ length: 3 }).map((_, index) => (
                <ListItemButton
                  key={index}
                  sx={{
                    padding: "10px 20px",
                    cursor: "pointer",
                  }}
                >
                  <Skeleton variant="circular" width={24} height={24} />
                  <ListItemText
                    primary=""
                    sx={{
                      opacity: isExpanded ? 1 : 0,
                      transition: "opacity 0.5s ease, visibility 0.5s ease",
                    }}
                  />
                </ListItemButton>
              ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
    </Box>
  );
}

export default NavigationPanel;
