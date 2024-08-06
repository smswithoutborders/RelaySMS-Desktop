import React, { useState } from "react";
import {
  Typography,
  Box,
  IconButton,
  InputBase,
  Tooltip,
  Grid,
  Paper,
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
        return <SimpleDialog asPopover={false} open={true} onClose={() => setCurrentComponent(null)}/>;
      case "SecuritySettings":
        return <SecuritySettings />;
        case "Compose":
          return <Compose asPopover={false}/>;
      case "AdvancedSettings":
        return <AdvancedSettings />;
      default:
        return (
          <Box sx={{height: "100%"}}>          
          </Box>
        );
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Grid container sx={{ height: "100%" }}>
        <Grid
          item
          sm={1.5}
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

            <Tooltip  sx={{ mt: 3 }}>
              <IconButton onClick={handleHome}>
                <FaHouse size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("home")}</Typography>

            <Tooltip sx={{ mt: 3 }}>
              <IconButton onClick={handleComposeClick}>
                <FaPenToSquare size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("compose")}</Typography>

            <Tooltip sx={{ mt: 3 }}>
              <IconButton onClick={handleAddAccountsClick}>
                <FaUsers size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("addAccounts")}</Typography>

            <Tooltip sx={{ mt: 3 }}>
              <IconButton onClick={handleGatewayClients}>
                <FaTowerCell size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("gatewayClients")}</Typography>

            <Tooltip sx={{ mt: 3 }}>
              <IconButton onClick={handleLanguageChange}>
                <FaLanguage size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("changeLanguage")}</Typography>

            <Tooltip>
              <IconButton onClick={handleMenuChange} sx={{ mt: 2 }}>
                <FaEllipsis size="17px" />
              </IconButton>
            </Tooltip>
            <Typography sx={{ mb: 3 }} textAlign="center" variant="body2">{t("settings")}</Typography>

          </Box>
        </Grid>

        <Grid
          item
          sm={3}
          sx={{
            flexShrink: 0,
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#2176AE",
            color: "#fff"
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
      {/* <Compose open={currentComponent === "Compose"} onClose={() => setCurrentComponent(null)} /> */}
    </Box>
  );
}
