import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  InputBase,
  Tooltip,
  Grid,
  Paper,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FaEllipsis,
  FaHouse,
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
  const [currentComponent, setCurrentComponent] = useState(null);

  const handleAddAccountsClick = () => {
    setCurrentComponent("AddAccounts");
  };

  const handleLanguageChange = () => {
    setCurrentComponent("SelectLanguage");
  };

  const handleMenuChange = () => {
    setCurrentComponent("SecuritySettings");
  };

  const handleGatewayClients = () => {
    setCurrentComponent("AdvancedSettings");
  };

  const handleHome = () => {
    setCurrentComponent("");
  };

  const handleComposeClick = () => {
    setCurrentComponent("Compose");
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case "AddAccounts":
        return <AddAccounts asPopover={false} />;
      case "SelectLanguage":
        return (
          <SimpleDialog
            asPopover={false}
            open={true}
            onClose={() => setCurrentComponent(null)}
          />
        );
      case "SecuritySettings":
        return <SecuritySettings />;
      case "Compose":
        return (
          <Compose 
            open={currentComponent === "Compose"} 
            onClose={() => setCurrentComponent(null)} 
          />
        );
      case "AdvancedSettings":
        return <AdvancedSettings />;
      default:
        return null;
    }
  };

  const handleSend = async () => {
    const text = "Testing!!!";
    try {
      const number = "670338998";
      console.log("Retrieved number:", number);
      if (!number) {
        console.error("No MSISDN selected");
        return;
      }
    const body = await window.api.sendSMS({ text, number });
    console.log("body:", body)
      console.log("SMS sent successfully");
    } catch (error) {
      console.error("Error sending SMS1:", error);
    }
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
            <Tooltip>
              <Box
                component="img"
                src="icon.png"
                sx={{ width: "25%", my: 3 }}
              />
            </Tooltip>

            <Tooltip onClick={handleHome} sx={{ mt: 2 }}>
              <IconButton>
                <FaHouse size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 1, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("home")}
            </Typography>

            <Tooltip onClick={handleComposeClick} sx={{ mt: 2 }}>
              <IconButton>
                <FaPenToSquare size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("compose")}
            </Typography>

            <Tooltip onClick={handleAddAccountsClick} sx={{ mt: 2 }}>
              <IconButton>
                <FaUsers size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("addAccounts")}
            </Typography>

            <Tooltip onClick={handleGatewayClients} sx={{ mt: 2 }}>
              <IconButton>
                <FaTowerCell size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("gatewayClients")}
            </Typography>

            <Tooltip onClick={handleLanguageChange} sx={{ mt: 2 }}>
              <IconButton>
                <FaLanguage size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("changeLanguage")}
            </Typography>

            <Tooltip onClick={handleMenuChange} sx={{ mt: 2 }}>
              <IconButton>
                <FaEllipsis size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("settings")}
            </Typography>
            <Button size="small" onClick={handleSend}>Send</Button>
          </Box>
        </Grid>

        <Grid
          item
          sm={3.3}
          sx={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#2176AE",
            color: "#fff",
            overflow: "none",
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
          {renderComponent()}
        </Grid>

        <Grid
          item
          sm={7.7}
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
    </Box>
  );
}
