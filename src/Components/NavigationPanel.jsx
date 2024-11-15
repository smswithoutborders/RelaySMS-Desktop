import React, { useState } from "react";
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
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

function NavigationPanel({ items = [] }) {
  const [isExpanded, setIsExpanded] = useState(true);

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
        <ListItem
          button
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
        </ListItem>

        <Divider />

        {items.length > 0
          ? items.map((item, index) => (
              <Tooltip
                title={!isExpanded && item.text ? item.text : ""}
                placement="right"
                key={index}
              >
                <ListItem
                  button
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
                </ListItem>
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
    </Drawer>
  );
}

export default NavigationPanel;
