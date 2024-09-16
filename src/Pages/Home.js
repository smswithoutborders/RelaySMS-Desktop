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
import MessageList from "../Components/MessageList";
import Joyride from "react-joyride";
import Login from "../Components/Login";
import Signup from "../Components/Signup";

export default function Landing() {
  const { t } = useTranslation();
  const [currentComponent, setCurrentComponent] = useState("Messages");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [runTutorial, setRunTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openSignupDialog, setOpenSignupDialog] = useState(false);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadMessages = async () => {
      const storedMessages =
        (await window.api.retrieveParams("messages")) || [];
      setMessages(storedMessages);
    };
    loadMessages();

    const isFirstTime = localStorage.getItem("firstTimeUser");
    if (!isFirstTime) {
      setRunTutorial(true);
      localStorage.setItem("firstTimeUser", "false");
    }
  }, []);

  const checkFileForToken = async () => {
    const tokenExists = await window.api.retrieveParams("longLivedToken");
    setFileExists(tokenExists);
  };

  useEffect(() => {
    checkFileForToken();
  }, []);

  const steps = [
    {
      target: ".add-accounts-button",
      content: (
        <div>
          <Typography sx={{ fontWeight: 600 }} variant="body2">
            {t("addAccounts")}
          </Typography>
          <Typography variant="body2">{t("tutorial.addAccounts")}</Typography>
        </div>
      ),
      disableBeacon: true,
    },
    {
      target: ".security-settings-button",
      content: t("tutorial.addGatewayClients"),
    },
    {
      target: ".compose-button",
      content: t("tutorial.compose"),
    },
  ];

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

  const openLoginDialogHandler = () => {
    setOpenLoginDialog(true);
  };

  const closeLoginDialogHandler = async () => {
    setOpenLoginDialog(false);
    await checkFileForToken();
  };

  const openSignupDialogHandler = () => {
    setOpenSignupDialog(true);    
  };

  const closeSignupDialogHandler = async () => {
    setOpenSignupDialog(false);
    await checkFileForToken();
  };

  const renderComponent = () => {
    if (!fileExists) {
      return (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            {t("notLoggedIn")}
          </Typography>
          <Typography sx={{ py: 2 }} variant="body2" gutterBottom>
            {t("needToLogIn")}
          </Typography>
          <Button
            variant="contained"
            onClick={openLoginDialogHandler}
            sx={{ borderRadius: 5, textTransform: "none", mr: 2, px: 3 }}
          >
            {t("login")}
          </Button>
          <Button
            variant="contained"
            onClick={openSignupDialogHandler}
            sx={{ borderRadius: 5, textTransform: "none" }}
          >
            {t("signUp")}
          </Button>
          {openLoginDialog && (
            <Login open={openLoginDialog} onClose={closeLoginDialogHandler} />
          )}
          {openSignupDialog && (
            <Signup
              open={openSignupDialog}
              onClose={closeSignupDialogHandler}
            />
          )}
        </Box>
      );
    } else
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
                  {t("compose")}{" "}
                  <FaPenToSquare style={{ marginLeft: 10 }} size="15px" />
                </Button>
              </Box>
              <MessageList
                messages={filteredMessages}
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
      <Joyride
        steps={steps}
        run={runTutorial}
        continuous
        showProgress
        showSkipButton
        disableCloseOnEsc
        disableOverlayClose
        callback={(data) => {
          if (data.action === "close" || data.status === "finished") {
            setRunTutorial(false);
          }
        }}
      />
      <Grid
        container
        sx={{
          flexGrow: 1,
          overflow: "hidden",
        }}
      >
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

            <Tooltip onClick={handleHome} sx={{ mt: 3 }}>
              <IconButton>
                <FaMessage size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("messages")}
            </Typography>

            <Tooltip
              className="compose-button"
              onClick={handleComposeClick}
              sx={{ mt: 5 }}
            >
              <IconButton>
                <FaPenToSquare size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("compose")}
            </Typography>

            <Tooltip
              className="add-accounts-button"
              onClick={handleAddAccountsClick}
              sx={{ mt: 5 }}
            >
              <IconButton>
                <FaUsers size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("addAccounts")}
            </Typography>

            <Tooltip
              className="security-settings-button"
              onClick={handleGatewayClients}
              sx={{ mt: 5 }}
            >
              <IconButton>
                <FaTowerCell size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("gatewayClients")}
            </Typography>

            <Tooltip onClick={handleLanguageChange} sx={{ mt: 5 }}>
              <IconButton>
                <FaGlobe size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
              textAlign="center"
              variant="body2"
            >
              {t("language")}
            </Typography>

            <Tooltip onClick={handleMenuChange} sx={{ mt: 5 }}>
              <IconButton>
                <FaEllipsis size="15px" />
              </IconButton>
            </Tooltip>
            <Typography
              sx={{ fontSize: "11px" }}
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
            backgroundColor: "background.side",
            overflowY: "auto",
          }}
        >
          <Box
            sx={{
              pr: 6,
              py: 2,
              backgroundColor: "background.custom",
              position: "sticky",
              top: 0,
              zIndex: 1000,
            }}
          >
            <Paper component="form">
              <InputBase
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={t("search")}
                endAdornment={<FaMagnifyingGlass style={{ marginRight: 5 }} />}
                sx={{
                  width: "100%",
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
