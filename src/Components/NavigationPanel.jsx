import React, { useState, useEffect } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Divider,
  IconButton,
  Tooltip,
  Skeleton,
  ListItemButton,
  Box,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

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
    <Drawer
      variant="permanent"
      sx={{
        width: isExpanded ? 240 : 72,
        transition: "width 0.5s ease",
        flexShrink: 0,
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
              <ListItem
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
              </ListItem>
            ))}
      </List>

      {app && (
        <List sx={{ mt: "auto" }}>
          <ListItemButton
            onClick={app.action}
            size="small"
            sx={{
              cursor: "pointer",
              bgcolor: "background.primary",
              mb: 2,
            }}
          >
            <ListItemIcon>
              <Box
                component="img"
                src={app.icon || ""}
                style={{ width: "35px" }}
                alt={app.text || ""}
              />
            </ListItemIcon>
            <ListItemText
              primary={app.text || ""}
              sx={{
                opacity: isExpanded ? 1 : 0,
                transition: "opacity 0.5s ease, visibility 0.5s ease",
                whiteSpace: "nowrap",
                textOverflow: "ellipsis",
              }}
            />
          </ListItemButton>
        </List>
      )}
    </Drawer>
  );
}

export default NavigationPanel;
