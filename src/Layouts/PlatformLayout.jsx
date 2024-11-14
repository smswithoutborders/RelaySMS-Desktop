import React, { useContext, useEffect, useState } from "react";
import { LayoutContext } from "../Contexts/LayoutContext";
import NavigationPanel from "../Components/NavigationPanel";
import ControlPanel from "../Components/ControlPanel";
import ComposeList from "../Components/ComposeList";
import DisplayPanel from "../Components/DisplayPanel";
import MessageList from "../Components/MessageList";
import ComposeView from "../Views/ComposeView";
import ComposeForm from "../Forms/ComposeForm";
import GatewayClientList from "../Components/GatewayClientList";

import {
  Settings,
  Edit,
  Add,
  CellTower,
  Language,
  HelpOutline,
  Message,
} from "@mui/icons-material";
import { Button, Snackbar, Alert } from "@mui/material";
import ListItems from "../Components/ListItems";
import CustomDialog from "../Components/CustomDialog";

function PlatformLayout() {
  const { setNavigationPanel, setControlPanel, setDisplayPanel } =useContext(LayoutContext);
  const [showAlert, setShowAlert] = useState(false);

  const languages = [
    { name: "English" },
    { name: "French" },
    { name: "Persian" },
    { name: "Spanish" },
    { name: "Turkish" },
  ];


  const settings = [
    { name: "Revoke Platforms" },
    { name: "Reset Password" },
    { name: "Log out" },
    { name: "Delete Account" },
  ];

  const gatewayClients = [
    {
      key: "+123456789",
      name: "Orange",
      country: "Nigeria",
      default: false,
      active: false,
    },
    {
      key: "+098765432",
      name: "MTN Cameroon",
      country: "Cameroon",
      default: false,
      active: false,
    },
    {
      key: "+012345678",
      name: "Twilio",
      country: "USA",
      default: true,
      active: false,
    }, // Assume this is the default client
    {
      key: "+908070605",
      name: "MTN",
      country: "Senegal",
      default: false,
      active: false,
    },
  ];

  const handleGatewayClientSelect = (client) => {
    console.log("Selected Gateway Client:", client);
  };

  const messages = [
    {
      avatar: "./gmail.png",
      title: "System Update",
      text: "Your system update was successful.",
      date: "2024-11-13",
    },
    {
      avatar: "./gmail.png",
      title: "Meeting Reminder",
      text: "Don't forget the meeting at 3 PM.",
      date: "2024-11-12",
    },
    {
      avatar: "./gmail.png",
      title: "Welcome Message",
      text: "Welcome to the platform! Let us know if you need help.",
      date: "2024-11-10",
    },
  ];

  const handleMessageClick = (message) => {
    setDisplayPanel(
      <DisplayPanel header={message.title} body={<div>{message.text}</div>} />
    );
  };

  const handleLogoutClick = () => {
    setDisplayPanel(
      <CustomDialog
        open={true}
        title="Log Out"
        description="Are you sure you want to log out?"
        onClose={() => setDisplayPanel(null)}
        onConfirm={() => {
          console.log("Logged out!");
          setDisplayPanel(null);
          setShowAlert(true);
        }}
      />
    );
  };

  const handleDeleteAccountClick = () => {
    setDisplayPanel(
      <CustomDialog
        open={true}
        title="Delete Account"
        description="Are you sure you want to delete your account? This action cannot be undone."
        onClose={() => setDisplayPanel(null)}
        onConfirm={() => {
          console.log("Account deleted!");
          setDisplayPanel(null);
          setShowAlert(true);
        }}
      />
    );
  };

  const handleSettingClick = (setting) => {
    switch (setting.name) {
      case "Log out":
        handleLogoutClick();
        break;
      case "Delete Account":
        handleDeleteAccountClick();
        break;
      default:
        console.log("No action defined for this setting");
    }
  };


  const services = [
    {
      name: "Gmail",
      avatar: "./gmail.png",
    },
    {
      name: "Twitter",
      avatar: "./twitter.png",
    },
    {
      name: "Telegram",
      avatar: "./telegram.png",
    },
  ];

  const handleServiceClick = (service) => {
    const handleFormSubmit = (data) => {
      console.table(data);
      alert(`Form submitted with data: ${JSON.stringify(data)}`);
      setDisplayPanel(null);
    };
  
    let fields = [];
  
    if (service.name === "Gmail") {
      fields = [
        { name: "from", label: "From", required: true, type: "email" },
        { name: "to", label: "To", required: true, type: "email" },
        { name: "cc", label: "Cc", required: false },
        { name: "bcc", label: "BCC", required: false },
        { name: "subject", label: "Subject", required: true },
        { name: "body", label: "", required: true, multiline: true, rows: 10 },
      ];
    } else if (service.name === "Twitter") {
      fields = [
        { name: "status", label: "What is happening?", required: true, multiline: true, rows: 8 },
      ];
    } else if (service.name === "Telegram") {
      fields = [
        { name: "to", label: "To (Phone Number)", required: true, type: "tel" },
        { name: "message", label: "Message", required: true, multiline: true, rows: 8 },
      ];
    }
  
    setDisplayPanel(
      <DisplayPanel
        header={`Compose ${service.name}`}
        body={
          <ComposeView
            formComponent={<ComposeForm fields={fields} onSubmit={handleFormSubmit} />}
            onClose={() => setDisplayPanel(null)}
          />
        }
      />
      
    );
  };
  
  const navItems = [
    {
      text: "Messages",
      icon: <Message />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Messages"
            element={
              <MessageList
                messages={messages}
                onMessageClick={handleMessageClick}
              />
            }
          />
        ),
    },
    {
      text: "Compose",
      icon: <Edit />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Compose"
            element={
              <ComposeList
                services={services}
                onServiceClick={handleServiceClick}
              />
            }
          />
        ),
    },
    {
      text: "Add Accounts",
      icon: <Add />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Add Accounts"
            element={<ComposeList services={services}/>}
          />
        ),
    },
    {
      text: "Gateway Clients",
      icon: <CellTower />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Gateway Clients"
            element={
              <GatewayClientList
                items={gatewayClients}
                onSelect={handleGatewayClientSelect}
              />
            }
          />
        ),
    },
    {
      text: "Change Language",
      icon: <Language />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Change Language"
            element={<ListItems items={languages} />}
          />
        ),
    },
    {
      text: "Settings",
      icon: <Settings />,
      action: () =>
        setControlPanel(
        <ControlPanel 
        title="Settings"
         element={<ListItems items={settings}  onItemClick={handleSettingClick}/>}
         />
        ),
    },
    {
      text: "Help",
      icon: <HelpOutline />,
      action: () =>
        setControlPanel(
          <ControlPanel
            title="Help"
            element={<div>Welcome to the Help Page</div>}
          />
        ),
    },
  ];

  useEffect(() => {
    setNavigationPanel(<NavigationPanel items={navItems} />);
  }, [setNavigationPanel, setControlPanel]);

  return (
    <Snackbar
      open={showAlert}
      autoHideDuration={4000}
      onClose={() => setShowAlert(false)}
    >
      <Alert onClose={() => setShowAlert(false)} severity="success">
        Alert clicked
      </Alert>
    </Snackbar>
  );
}

export default PlatformLayout;
