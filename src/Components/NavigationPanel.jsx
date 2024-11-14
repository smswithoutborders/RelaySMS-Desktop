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
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: isExpanded ? 240 : 72,
          transition: "width 0.3s",
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
            padding: "10px",
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
                    display: "flex",
                    justifyContent: isExpanded ? "flex-start" : "center",
                    padding: "10px 20px",
                  }}
                >
                  {item.icon ? (
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        pr: isExpanded ? 2 : 0,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  ) : (
                    <Skeleton variant="circular" width={24} height={24} />
                  )}
                  {isExpanded ? (
                    item.text ? (
                      <ListItemText primary={item.text} />
                    ) : (
                      <Skeleton variant="text" width="60%" />
                    )
                  ) : null}
                </ListItem>
              </Tooltip>
            ))
          : Array.from({ length: 3 }).map((_, index) => (
              <ListItem
                key={index}
                sx={{
                  display: "flex",
                  justifyContent: isExpanded ? "flex-start" : "center",
                  padding: "10px 20px",
                }}
              >
                <Skeleton variant="circular" width={24} height={24} />
                {isExpanded && <Skeleton variant="text" width="60%" />}
              </ListItem>
            ))}
      </List>
    </Drawer>
  );
}

export default NavigationPanel;
