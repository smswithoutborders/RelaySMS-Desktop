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
  styled,
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
import ResetPassword from "../Components/ResetPassword";
import RevokeDialog from "../Components/RevokeDialog";
import DeleteDialog from "../Components/DeleteDialog";
import Logout from "../Components/Logout";
import NewPassword from "../Components/NewPassword";
import Help from "./Help";
import Tutorial from "./Tutorial";

const CustomTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} sx={{ mt: 3 }} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: "white",
    color: "gray",
    borderRadius: "10px",
    fontSize: "14px",
  },
}));

export default function Landing() {
  const { t } = useTranslation();
  const [currentComponent, setCurrentComponent] = useState("Messages");
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [runTutorial, setRunTutorial] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [fileExists, setFileExists] = useState(false);
  const [openDialog, setOpenDialog] = useState("");

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
    setOpenDialog("");
    setCurrentComponent("AddAccounts");
  };

  const handleLanguageChange = () => {
    setOpenDialog("");
    setCurrentComponent("SelectLanguage");
  };

  const handleMenuChange = () => {
    setOpenDialog("");
    setCurrentComponent("SecuritySettings");
  };

  const handleHelp = () => {
    setOpenDialog("");
    setCurrentComponent("Help");
  };

  const handleGatewayClients = () => {
    setOpenDialog("");
    setCurrentComponent("AdvancedSettings");
  };

  const handleHome = async () => {
    setOpenDialog("");
    setCurrentComponent("Messages");
    await loadMessages();
  };

  const handleComposeClick = () => {
    setOpenDialog("");
    setCurrentComponent("Compose");
  };

  const handleMessageClick = (message) => {
    setOpenDialog("");
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
    setOpenDialog("login");
  };

  const closeLoginDialogHandler = async () => {
    setOpenDialog("");
    await checkFileForToken();
  };

  const openSignupDialogHandler = () => {
    setOpenDialog("signup");
  };

  const closeSignupDialogHandler = async () => {
    setOpenDialog("");
    await checkFileForToken();
  };

  const handleOpenReset = () => {
    setOpenDialog("reset");
  };

  const handleCloseReset = () => {
    setOpenDialog("");
  };

  const handleOpenRevokeDialog = () => {
    setOpenDialog("revoke");
  };
  const handleOpenNewPassword = () => {
    setOpenDialog("resetpassword");
  };
  const handleOpenDeleteDialog = () => {
    setOpenDialog("delete");
  };
  const handleLogout = () => {
    setOpenDialog("logout");
    if (!fileExists) {
      setOpenDialog("");
    }
  };
  const handleOpenTutorial = () => {
    setOpenDialog("tutorial");
  };

  const renderComponentInLargeGrid = () => {
    if (!fileExists) {
      return (
        <Box
          sx={{
            px: 7,
            m: "auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "90vh",
          }}
        >
          {openDialog === "login" && (
            <Login
              onForgotPassword={() => {
                closeLoginDialogHandler();
                handleOpenReset();
              }}
              open={openDialog === "login"}
              onClose={closeLoginDialogHandler}
            />
          )}
          {openDialog === "reset" && (
            <ResetPassword
              onClose={handleCloseReset}
              open={openDialog === "reset"}
            />
          )}

          {openDialog === "signup" && (
            <Signup
              open={openDialog === "signup"}
              onClose={closeSignupDialogHandler}
            />
          )}
        </Box>
      );
    }
    return (
      <>
        {openDialog === "revoke" && <RevokeDialog />}
        {openDialog === "delete" && <DeleteDialog />}
        {openDialog === "resetpassword" && <NewPassword />}
        {openDialog === "tutorial" && <Tutorial />}
        {openDialog === "logout" && (
          <Logout onLogoutSuccess={() => checkFileForToken(false)} />
        )}
        {!selectedMessage && messages.length > 0 && openDialog === "" && (
          <Typography variant="body1" sx={{ fontWeight: 600 }}>
            {t("selectMessage")}
          </Typography>
        )}
        {selectedMessage && openDialog === "" && (
          <Box sx={{ px: 2, mt: 4 }}>
            <Typography variant="h6">
              {selectedMessage.subject || t("noSubject")}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} color="textSecondary">
              {selectedMessage.from}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }} component="div">
              {selectedMessage.message}
            </Typography>
            <Typography variant="body2" sx={{ mt: 4 }} color="textSecondary">
              {selectedMessage.timestamp}
            </Typography>
          </Box>
        )}
      </>
    );
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

        case "Compose":
          return (
            <Compose
              open={currentComponent === "Compose"}
              onClose={() => setCurrentComponent(null)}
            />
          );
        case "SecuritySettings":
          return (
            <SecuritySettings
              handleDeleteClick={handleOpenDeleteDialog}
              handleRevokeTokensClick={handleOpenRevokeDialog}
              handleLogoutClick={handleLogout}
              openResetPasswordDialog={handleOpenNewPassword}
            />
          );
        case "Help":
          return <Help onOpenTutorial={handleOpenTutorial} />;
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
    <Box sx={{ display: "flex", height: "100vh", overflow: "auto" }}>
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
      <Grid container>
        <Grid
          item
          sm={1}
          md={1}
          lg={0.5}
          sx={{
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
            }}
          >
            <CustomTooltip
              placement="right"
              title={t("messages")}
              onClick={handleHome}
            >
              <IconButton>
                <FaRegComments size="20px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("compose")}
              className="compose-button"
              onClick={handleComposeClick}
            >
              <IconButton>
                <FaPenToSquare size="19px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("addAccounts")}
              className="add-accounts-button"
              onClick={handleAddAccountsClick}
            >
              <IconButton>
                <FaPlus size="20px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("gatewayClients")}
              className="security-settings-button"
              onClick={handleGatewayClients}
            >
              <IconButton>
                <FaTowerBroadcast size="20px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("language")}
              onClick={handleLanguageChange}
            >
              <IconButton>
                <FaGlobe size="20px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("more")}
              onClick={handleMenuChange}
            >
              <IconButton>
                <FaEllipsis size="20px" />
              </IconButton>
            </CustomTooltip>

            <CustomTooltip
              placement="right"
              title={t("help")}
              onClick={handleHelp}
            >
              <IconButton>
                <FaRegCircleQuestion size="20px" />
              </IconButton>
            </CustomTooltip>
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

        <Grid item sm={7.7} md={7.7} lg={7.7} sx={{overflowY: "auto", height: "100vh"}}>
          <Box
            sx={{
              py: 3,
              px: 2,
            }}
          >
            {renderComponentInLargeGrid()}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
