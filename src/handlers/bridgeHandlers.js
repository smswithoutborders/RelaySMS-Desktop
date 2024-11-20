import {
  DisplayPanel,
  ControlPanel,
  GatewayClientList,
  MessageList,
  ItemsList,
  ServiceList,
} from "../Components";
import { ComposeForm, PasswordForm } from "../Forms";
import { DialogView, SettingView, ComposeView } from "../Views";
import { MessageController } from "../controllers";

const languages = [
  { name: "English" },
  { name: "French" },
  { name: "Persian" },
  { name: "Spanish" },
  { name: "Turkish" },
];

const logout = {
  title: "Are you sure you want to log out?",
  description: "This action cannot be undone.",
  color: "",
};

const deleteAccount = {
  title: "Are you sure you want to delete your account? ",
  description: "This action cannot be undone.",
  color: "error",
};

export const handleBridgeMessageClick = (setDisplayPanel, message) => {
  setDisplayPanel(
    <DisplayPanel header={message.title} body={<div>{message.text}</div>} />
  );
};

export const handleGatewayClientToggle = ({ client, setAlert }) => {
  setAlert({
    open: true,
    message: client.key,
    severity: "info",
  });
};

export const handleBridgeComposeSelect = ({
  setControlPanel,
  setDisplayPanel,
}) => {
  const bridges = [{name: "Email" }];

  setDisplayPanel(null);

  setControlPanel(
    <ControlPanel
      title="Compose"
      element={
        <ServiceList
          serviceType="Bridges"
          services={bridges}
          onClick={(bridge) =>
            handleBridgeComposeClick({ setDisplayPanel, bridge })
          }
        />
      }
    />
  );
};

export const handleBridgeComposeClick = ({ setDisplayPanel, bridge }) => {
  const handleFormSubmit = (data) => {
    console.table(data);
    alert(`Form submitted with data: ${JSON.stringify(data)}`);
    setDisplayPanel(null);
  };

  let fields = [];
  if (bridge.name === "Email") {
    fields = [
      { name: "from", label: "From", required: true, type: "email" },
      { name: "to", label: "To", required: true, type: "email" },
      { name: "cc", label: "Cc", required: false },
      { name: "bcc", label: "BCC", required: false },
      { name: "subject", label: "Subject", required: true },
      { name: "body", label: "", required: true, multiline: true, rows: 10 },
    ];
  } 

  setDisplayPanel(
    <DisplayPanel
      header={`Compose ${bridge.name}`}
      body={
        <ComposeView onClose={() => setDisplayPanel(null)}>
          <ComposeForm fields={fields} onSubmit={handleFormSubmit} />
        </ComposeView>
      }
    />
  );
};

export const handleGatewayClientSelect = ({
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
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
    },
    {
      key: "+908070605",
      name: "MTN",
      country: "Senegal",
      default: false,
      active: false,
    },
  ];

  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel
      title="Gateway Clients"
      element={
        <GatewayClientList
          items={gatewayClients}
          onSelect={(client) => handleGatewayClientToggle({ client, setAlert })}
        />
      }
    />
  );
};

export const handleMessagesSelect = ({
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  const messageController = new MessageController("bridgeMessages");

  messageController.createMessage({
    avatar: "",
    title: "Hey Bridge",
    text: "Your bridge update was successful.",
    date: "2024-11-13",
  });

  const messages = messageController.getMessagesList();

  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel
      title="Messages"
      element={
        <MessageList
          messages={messages}
          onClick={(message) =>
            handleBridgeMessageClick(setDisplayPanel, message)
          }
        />
      }
    />
  );
};

export const handleBridgeSettingsSelect = ({
  setDisplayPanel,
  setControlPanel,
}) => {
  const settings = [
    {
      name: "Language",
      action: () =>
        setDisplayPanel(
          <DisplayPanel body={<ItemsList items={languages} />} />
        ),
    },
    {
      name: "Log out",
      action: () =>
        setDisplayPanel(
          <DisplayPanel
            body={
              <DialogView
                open={true}
                title={logout.title}
                description={logout.description}
                cancelText="cancel"
                confirmText="logout"
                onClose={() => setDisplayPanel(null)}
                onConfirm={() => {
                  alert("Logged out successfully");
                  setDisplayPanel(null);
                }}
              />
            }
          />
        ),
    },
    {
      name: "Delete Account",
      action: () =>
        setDisplayPanel(
          <DisplayPanel
            header={"Delete Account"}
            body={
              <SettingView>
                <PasswordForm
                  fields={[
                    {
                      name: "currentPassword",
                      label: "Current Password",
                      required: true,
                      type: "password",
                    },
                  ]}
                  submitButtonText="Delete Account"
                  submitButtonColor="error"
                  onSubmit={(data) => {
                    setDisplayPanel(
                      <DialogView
                        open={true}
                        title={deleteAccount.title}
                        description={deleteAccount.description}
                        cancelText="cancel"
                        confirmText="yes, delete account"
                        onClose={() => setDisplayPanel(null)}
                        onConfirm={() => {
                          alert("Delete Account successfully");
                          console.log("Password form submitted:", data);
                          setDisplayPanel(null);
                        }}
                      />
                    );
                  }}
                />
              </SettingView>
            }
          />
        ),
    },
  ];

  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel title="Settings" element={<ItemsList items={settings} />} />
  );
};
