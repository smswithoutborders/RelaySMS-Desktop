import React, { useState, useEffect } from "react";
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
  FaGlobe,
  FaHouse,
  FaMagnifyingGlass,
  FaMessage,
  FaPenToSquare,
  FaRegCircleQuestion,
  FaTowerCell,
  FaUsers,
} from "react-icons/fa6";
import Compose from "./Compose";
import AddAccounts from "../Components/AddAccounts";
import SimpleDialog from "../Components/SelectLanguage";
import SecuritySettings from "./SecuritySetting";
import AdvancedSettings from "./AdvancedSettings";
import Footer from "../Components/Footer";
import MessageList from "../Components/MessageList";

export default function Landing() {
  const { t } = useTranslation();
  const [currentComponent, setCurrentComponent] = useState("Messages");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages =
        (await window.api.retrieveParams("messages")) || [];
      setMessages(storedMessages);
    };

    loadMessages();
  }, []);

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
    setCurrentComponent("Messages");
  };

  const handleComposeClick = () => {
    setCurrentComponent("Compose");
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const refreshMessages = (updatedMessages) => {
    setMessages(updatedMessages);
    if (
      !updatedMessages.some(
        (msg) => msg.timestamp === selectedMessage?.timestamp
      )
    ) {
      setSelectedMessage(null);
    }
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
      case "Messages":
        return (
          <>
          <Box
            sx={{
              mt: 2,
              mx: 3,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
             {t("messages")}
            </Typography>
            <Button
            size="small"
              variant="contained"
              sx={{ textTransform: "none" }}
              onClick={handleComposeClick}
            >
              {t("compose")} {" "} <FaPenToSquare size="15px" />
            </Button>
          </Box>
          <MessageList
            messages={messages}
            onMessageSelect={handleMessageClick}
            refreshMessages={refreshMessages}
          />
          </>
        );
      default:
        return null;
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
                <FaMessage size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 1, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("messages")}
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
                <FaGlobe size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ mb: 2, fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("language")}
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
              {t("more")}
            </Typography>
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
        <Grid item sm={7.7}>
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
              {selectedMessage ? selectedMessage.from : t("recent")}
            </Typography>
            <Tooltip title="Help">
              <IconButton>
                <FaRegCircleQuestion size="16px" />
              </IconButton>
            </Tooltip>
          </Box>

          {selectedMessage ? (
            selectedMessage.platform === "gmail" ? (
              <Box sx={{ px: 2, mt: 4 }}>
                <Typography variant="h6">
                  {selectedMessage.subject || t("noSubject")}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 1 }}
                  color="textSecondary"
                >
                  {selectedMessage.from}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1 }} component="div">
                  {selectedMessage.message}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 4 }}
                  color="textSecondary"
                >
                  {selectedMessage.timestamp}
                </Typography>
              </Box>
            ) : selectedMessage.platform === "twitter" ? (
              <Box sx={{ px: 2, mt: 4 }}>
                <Typography variant="body2" sx={{ mt: 1 }} component="div">
                  {selectedMessage.message}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ mt: 4 }}
                  color="textSecondary"
                >
                  {selectedMessage.timestamp}
                </Typography>
              </Box>
            ) : null
          ) : (
            <Typography
              sx={{ px: 2, pt: 4 }}
              variant="h5"
              color="textSecondary"
            >
              {messages.length === 0 ? t("noMessages") : t("selectMessage")}
            </Typography>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
