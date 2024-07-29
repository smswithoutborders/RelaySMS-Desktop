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
import { FaEllipsisVertical, FaGlobe, FaMagnifyingGlass, FaPenToSquare, FaServer, FaShieldHalved, FaTowerCell, FaUsers } from "react-icons/fa6";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";
import Compose from "./Compose";
import { FaLanguage } from "react-icons/fa";
import AddAccounts from "../Components/AddAccounts";
import SimpleDialog from "../Components/SelectLanguage";
import SecuritySettings from "./SecuritySetting";
import AdvancedSettings from "./AdvancedSettings";
//import { FaChevronCircleRight } from "react-icons/fa";

export default function Landing() {
  const { t } = useTranslation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [composeDrawerOpen, setComposeDrawerOpen] = useState(false);
  const [addAccountsDrawerOpen, setAddAccountsDrawerOpen] = useState(false); 
  const [selectLanguage, setSelectLanguage] = useState(false); 
  const [mainMenu, setMainMenu] = useState(false); 
  const [gatewayClients, setGatewayClients] = useState(false); 

  const handleAddAccountsClick = () => {
    setAddAccountsDrawerOpen(true);
  };

  const handleAddAccountsDrawerClose = () => {
    setAddAccountsDrawerOpen(false);
  };


  const handleLanguageChange = () => {
    setSelectLanguage(true);
  };

  const handleLanguageChangeClose = () => {
    setSelectLanguage(false);
  };

  const handleMenuChange = () => {
    setMainMenu(true);
  };

  const handleMenuChangeClose = () => {
    setMainMenu(false);
  };

  const handleGatewayClients = () => {
    setGatewayClients(true);
  };

  const handleGatewayClientsClose = () => {
    setGatewayClients(false);
  };

  const handleCompose = () => {
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
          width: 320,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 320,
            boxSizing: "border-box",
          },
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", p: 2, backgroundColor: "background.custom"  }}>
          <Tooltip title="Menu">
            <IconButton onClick={handleMenuChange}>
              <FaEllipsisVertical size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Gateway Clients">
            <IconButton onClick={handleGatewayClients}>
              <FaTowerCell size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Change Language">
            <IconButton onClick={handleLanguageChange}>
              <FaLanguage size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Add Accounts">
            <IconButton onClick={handleAddAccountsClick}>
              <FaUsers size="16px" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Compose">
            <IconButton onClick={handleCompose}>
              <FaPenToSquare size="16px" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box sx={{ px: 3, pb: 2 }}>
          <InputBase
            placeholder={t("search")}
            variant="contained"
            startAdornment={
              <FaMagnifyingGlass style={{ marginRight: 20, marginLeft: 10 }} />
            }
            sx={{
              width: "100%",
              border: "1px solid gray",
              borderRadius: 3,
              padding: 0.2,
              mt: 2
            }}
          />
          {/* <Footer /> */}
        </Box>       
        
        <Compose open={composeDrawerOpen} onClose={handleComposeDrawerClose}/>
        <SimpleDialog open={selectLanguage} onClose={handleLanguageChangeClose}/>
        <SecuritySettings open={mainMenu} onClose={handleMenuChangeClose}/>
        <AdvancedSettings open={gatewayClients} onClose={handleGatewayClientsClose}/>
      </Drawer>

      <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Box sx={{ px: 5, py: 2, backgroundColor: "background.custom"  }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
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
      <AddAccounts open={addAccountsDrawerOpen} onClose={handleAddAccountsDrawerClose} />
    </Box>
  );
}
