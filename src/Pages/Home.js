import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  InputBase,
  Drawer,
  Tooltip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { FaEllipsisVertical, FaGlobe, FaMagnifyingGlass, FaPenToSquare, FaServer, FaShieldHalved } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Compose from "./Compose";
//import { FaChevronCircleRight } from "react-icons/fa";

export default function Landing() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [composeDrawerOpen, setComposeDrawerOpen] = useState(false);


  const handlePenClick = () => {
    setComposeDrawerOpen(true);
  };

  const handleComposeDrawerClose = () => {
    setComposeDrawerOpen(false);
  };

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
<Drawer
       // onClick={toggleDrawer}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: 60,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 60,
            boxSizing: "border-box",
            backgroundColor: "#0F171F"
          },
        }}
      >
          <Tooltip title="Compose" sx={{py: 3}}>
            <IconButton>
              <FaGlobe size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compose" sx={{py: 3}}>
            <IconButton>
              <FaServer size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compose" sx={{py: 3}}>
            <IconButton>
              <FaShieldHalved size="20px" />
            </IconButton>
          </Tooltip>
              </Drawer>

      <Drawer
       // onClick={toggleDrawer}
        variant="persistent"
        anchor="left"
        open={isDrawerOpen}
        sx={{
          width: 280,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 280,
            boxSizing: "border-box",
            marginLeft: 7
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
          <Tooltip title="Settings">
            <IconButton component={Link} to="/settings">
              <FaEllipsisVertical size="20px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compose">
            <IconButton onClick={handlePenClick}>
              <FaPenToSquare size="20px" />
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
          <Footer />
        </Box>       
        
        <Compose open={composeDrawerOpen} onClose={handleComposeDrawerClose}/>
      </Drawer>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ px: 5, pt: 5 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            {t("recent")}
          </Typography>
        </Box>
        <Box my="auto" sx={{ textAlign: "center" }}>
          <Box component="img" src="nomessages.png" sx={{ width: "25%" }} />
          <Typography variant="h4">{t("noRecentMessages")}</Typography>
          <Typography variant="body1" sx={{ pt: 2 }}>
            {t("startConversation")}
          </Typography>
        </Box>      
      </Box>
    </Box>
  );
}
