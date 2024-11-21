import React, { useState, useEffect } from "react";
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
import { Link } from "react-router-dom";

function NavigationPanel({ items = [], app }) {
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    if (items.length > 0) {
      const defaultItem = items.find((item) => item.default);
      if (defaultItem && defaultItem.action) {
        defaultItem.action();
      }
    }
  }, [items]);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
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
        <Tooltip title="Home" placement="right">
          <Link to="/">
          <ListItemButton>
            <ListItemIcon>
              <Box
                component="img"
                src="logo.png"
                alt="Relay"
                sx={{ width: "33px", bgcolor: "#eaeaea", p: 0.5, borderRadius: 1 }}
              />
            </ListItemIcon>
          </ListItemButton>
          </Link>
        </Tooltip>
        <Tooltip title="Settings" placement="right">
        <Link to="/deku">
          <ListItemButton>
            <ListItemIcon>
              <Box
                component="img"
                src="Deku.png"
                alt="Deku"
                sx={{ width: "33px", bgcolor: "#eaeaea", p: 0.5, borderRadius: 1 }}
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
                  title={!isExpanded && item.text ? item.text : ""}
                  placement="right"
                  key={index}
                >
                  <ListItemButton
                    onClick={item.action}
                    sx={{
                      padding: "10px 20px",
                      cursor: "pointer",
                    }}
                  >
                    {item.icon ? (
                      <ListItemIcon>{item.icon}</ListItemIcon>
                    ) : (
                      <Skeleton variant="circular" width={24} height={24} />
                    )}
                    <ListItemText
                      primary={item.text}
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
