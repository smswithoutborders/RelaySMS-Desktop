import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  IconButton,
  Tooltip,
  Grid,
  Button,
  Divider,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  FaEllipsis,
  FaGlobe,
  FaMagnifyingGlass,
  FaPenToSquare,
  FaPlus,
  FaRegCircleQuestion,
  FaRegComments,
  FaTowerBroadcast,
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
import { Link } from "react-router-dom";
import ResetPassword from "../Components/ResetPassword";

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
  const [openResetDialog, setOpenResetDialog] = useState(false);

  const handleOpenReset = () => {
    setOpenResetDialog(true);
  };

  const handleCloseReset = () => {
    setOpenResetDialog(false);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredMessages = messages.filter(
    (message) =>
      message.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.from?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      message.message?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadMessages = async () => {
    const storedMessages = (await window.api.retrieveParams("messages")) || [];
    setMessages(storedMessages);
  };

  useEffect(() => {
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

  const handleHome = async () => {
    setCurrentComponent("Messages");
    await loadMessages();
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
          <Typography sx={{ fontWeight: 600 }} variant="body2" gutterBottom>
            {t("notLoggedIn")}
          </Typography>
          <Typography sx={{ py: 2 }} variant="body2" gutterBottom>
            {t("needToLogIn")}
          </Typography>
          <Button
            size="small"
            variant="contained"
            onClick={openLoginDialogHandler}
            sx={{ borderRadius: 5, textTransform: "none", mr: 2, px: 2 }}
          >
            {t("login")}
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={openSignupDialogHandler}
            sx={{ borderRadius: 5, textTransform: "none" }}
          >
            {t("signUp")}
          </Button>
          {openLoginDialog && (
            <Login
              onForgotPassword={() => {
                closeLoginDialogHandler();
                handleOpenReset();
              }}
              open={openLoginDialog}
              onClose={closeLoginDialogHandler}
            />
          )}
          <ResetPassword onClose={handleCloseReset} open={openResetDialog} />

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
          return (
            <AdvancedSettings
              open={true}
              onClose={() => setCurrentComponent(null)}
            />
          );
        case "Messages":
          return (
            <>
              <Box
                sx={{
                  mt: 2,
                  mx: 2,
                }}
              >
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {t("messages")}
                </Typography>
                <FormControl sx={{ width: "100%" }} variant="standard">
                  <InputLabel sx={{ fontSize: "13px" }}>
                    {t("search")}
                  </InputLabel>
                  <Input
                    size="small"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    id="standard-adornment-password"
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleSearchChange}
                          onMouseDown={handleSearchChange}
                        >
                          <FaMagnifyingGlass size="13px" />
                        </IconButton>
                      </InputAdornment>
                    }
                  />
                </FormControl>
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
          md={1}
          lg={0.5}
          sx={{
            flexShrink: 0,
            backgroundColor: "background.side",
            height: "100vh",
            px: 0,
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
            <Tooltip
              arrow
              placement="right"
              title={t("messages")}
              onClick={handleHome}
            >
              <IconButton>
                <FaRegComments size="20px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("compose")}
              className="compose-button"
              onClick={handleComposeClick}
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaPenToSquare size="19px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("addAccounts")}
              className="add-accounts-button"
              onClick={handleAddAccountsClick}
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaPlus size="20px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("gatewayClients")}
              className="security-settings-button"
              onClick={handleGatewayClients}
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaTowerBroadcast size="20px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("language")}
              onClick={handleLanguageChange}
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaGlobe size="20px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("more")}
              onClick={handleMenuChange}
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaEllipsis size="20px" />
              </IconButton>
            </Tooltip>

            <Tooltip
              arrow
              placement="right"
              title={t("help")}
              component={Link}
              to="/help"
              sx={{ mt: 3 }}
            >
              <IconButton>
                <FaRegCircleQuestion size="20px" />
              </IconButton>
            </Tooltip>
          </Box>
        </Grid>
        <Divider
          orientation="vertical"
          sx={{ bgcolor: "background.default" }}
        />

        <Grid
          item
          sm={3.3}
          md={3.3}
          xl={3.3}
          sx={{
            height: "100vh",
            display: "flex",
            py: 1,
            flexDirection: "column",
            backgroundColor: "background.side",
            overflowY: "auto",
          }}
        >
          {renderComponent()}
        </Grid>
        <Divider orientation="vertical" />

        <Grid item sm={7.7} md={7.7} xl={7.7}>
          <Box
            sx={{
              py: 3,
              px: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 600 }}>
              {selectedMessage ? selectedMessage.from : t("recent")}
            </Typography>
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
                  {selectedMessage.to}
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
