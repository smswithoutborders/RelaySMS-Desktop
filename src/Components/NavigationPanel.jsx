import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Skeleton,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useThemeMode } from "../Contexts/ThemeContext";

function NavigationPanel({ items = []}) {
  const [activeItem, setActiveItem] = useState(null);
  const { logo } = useThemeMode();

  const { t } = useTranslation();

  useEffect(() => {
    if (items.length > 0) {
      const defaultItem = items.find((item) => item.default);
      if (defaultItem && defaultItem.action) {
        defaultItem.action(defaultItem.text);
      }
    }
  }, [items]);

  const handleItemClick = (item) => {
    setActiveItem(item.text);
    if (item.action) item.action(item.text);
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
      <Divider orientation="vertical" />

      <Box
        variant="permanent"
        sx={{
          flexShrink: 0,
          width: 340,
        }}
      >
        <List>
          <Box
            component="img"
            src={logo}
            width="65%"
            mb={4}
            mt={2}
            ml={2.5}
            ss
          />
          {items.length > 0
            ? items.map((item, index) => (
                <ListItemButton
                  onClick={() => handleItemClick(item)}
                  sx={{
                    padding: "25px 30px",
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
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  />
                </ListItemButton>
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
                  <ListItemText primary="" />
                </ListItemButton>
              ))}
        </List>
      </Box>
      <Divider orientation="vertical" />
    </Box>
  );
}

export default NavigationPanel;
