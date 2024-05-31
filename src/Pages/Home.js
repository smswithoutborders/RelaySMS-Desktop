import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  InputBase,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaEllipsisVertical, FaMagnifyingGlass } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

export default function Landing() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Drawer
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Tooltip title="Settings">
            <IconButton component={Link} to="/settings">
              <FaEllipsisVertical size="20px" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ px: 3, pb: 2 }}>
          <InputBase
            placeholder={t("search")}
            startAdornment={
              <FaMagnifyingGlass style={{ marginRight: 20, marginLeft: 10 }} />
            }
            sx={{
              width: "100%",
              border: "1px solid grey",
              borderRadius: 8,
              padding: 0.3,
            }}
          />
        </Box>
        <List>
          <ListItem button>
            <ListItemIcon>{/* Icon */}</ListItemIcon>
          </ListItem>
        </List>
      </Drawer>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ px: 7, mt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("recent")}
          </Typography>
        </Box>
        <Box my="auto" justifyContent="center" sx={{ px: 10 }}>
          <Box component="img" src="nomessages.png" sx={{ width: "25%" }} />
          <Typography variant="h4">{t("noRecentMessages")}</Typography>
          <Typography variant="body1" sx={{ pt: 2 }}>
            {t("startConversation")}
          </Typography>
        </Box>
        <Footer />
      </Box>
    </Box>
  );
}
