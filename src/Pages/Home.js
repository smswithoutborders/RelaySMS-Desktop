import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  InputBase,
  Drawer,
  Tooltip,
  Divider,
  Grid,
  Paper,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FaEllipsis,
  FaEllipsisVertical,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaRegCircleQuestion,
  FaTowerCell,
  FaUsers,
} from "react-icons/fa6";
import Compose from "./Compose";
import { FaLanguage } from "react-icons/fa";
import AddAccounts from "../Components/AddAccounts";
import SimpleDialog from "../Components/SelectLanguage";
import SecuritySettings from "./SecuritySetting";
import AdvancedSettings from "./AdvancedSettings";
import Footer from "../Components/Footer";

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
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          sm={1}
          sx={{
            flexShrink: 0,
            backgroundColor: "background.custom",
            height: "100vh",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              pt: 2,
            }}
          >
            <Tooltip sx={{ my: 3 }}>
              <Box
                component="img"
                src="icon.png"
                sx={{ width: "30%", my: 3 }}
              />
            </Tooltip>
            <Tooltip title="Add Accounts" sx={{ my: 3 }}>
              <IconButton onClick={handleAddAccountsClick}>
                <FaUsers size="17px" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gateway Clients" sx={{ my: 3 }}>
              <IconButton onClick={handleGatewayClients}>
                <FaTowerCell size="17px" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Change Language" sx={{ my: 3 }}>
              <IconButton onClick={handleLanguageChange}>
                <FaLanguage size="17px" />
              </IconButton>
            </Tooltip>
            <Tooltip title="More">
              <IconButton onClick={handleMenuChange} sx={{ my: 2 }}>
                <FaEllipsis size="17px" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>

        <Grid
          item
          sm={3.5}
          sx={{
            flexShrink: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#2176AE",
          }}
        >
          <Box sx={{ pr: 6, py: 2, backgroundColor: "background.custom" }}>
            <Paper component="form">
              <InputBase
                placeholder={t("search")}
                endAdornment={<FaMagnifyingGlass style={{ marginRight: 5 }} />}
                sx={{
                  width: "90%",
                  borderRadius: 3,
                  px: 0.5,
                  fontSize: "13px",
                }}
              />
            </Paper>
          </Box>
        </Grid>

        <Grid
          item
          sm={7.5}
          sx={{ flexShrink: 0, display: "flex", flexDirection: "column" }}
        >
          <Box
            sx={{
              py: 1.8,
              backgroundColor: "background.custom",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              px: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {t("recent")}
            </Typography>
            <Tooltip title="Help">
              <IconButton>
                <FaRegCircleQuestion size="16px" />
              </IconButton>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <Box component="img" src="nomessages.png" sx={{ width: "25%" }} />
            <Typography variant="h4">{t("noRecentMessages")}</Typography>
            <Typography variant="body1" sx={{ pt: 2 }}>
              {t("startConversation")}
            </Typography>
          </Box>
          <Footer />
        </Grid>
      </Grid>
      <Compose open={composeDrawerOpen} onClose={handleComposeDrawerClose} />
      <SimpleDialog open={selectLanguage} onClose={handleLanguageChangeClose} />
      <SecuritySettings open={mainMenu} onClose={handleMenuChangeClose} />
      <AdvancedSettings
        open={gatewayClients}
        onClose={handleGatewayClientsClose}
      />
      <AddAccounts
        open={addAccountsDrawerOpen}
        onClose={handleAddAccountsDrawerClose}
      />
    </Box>
  );
}
