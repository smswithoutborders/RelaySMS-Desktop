import {
  DisplayPanel,
  ControlPanel,
  ServiceList,
  GatewayClientList,
  MessageList,
  ItemsList,
} from "../Components";
import { ComposeForm, PasswordForm } from "../Forms";
import { DialogView, SettingView, ComposeView } from "../Views";
import {
  fetchPlatforms,
  listEntityStoredTokens,
} from "../controllers/platformControllers";
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

export const handlePlatformMessageClick = (setDisplayPanel, message) => {
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

export const handlePlatformComposeClick = ({ setDisplayPanel, platform }) => {
  const handleFormSubmit = (data) => {
    console.table(data);
    setDisplayPanel(null);
  };

  let fields;

  switch (platform.name) {
    case "Gmail":
      fields = [
        {
          name: "from",
          label: "From",
          required: true,
          type: "select",
          options: platform.identifiers.map((data) => ({
            label: data,
            value: data,
          })),
          defaultValue: platform.identifiers[0] || "",
        },
        { name: "to", label: "To", required: true, type: "email" },
        { name: "cc", label: "Cc", required: false },
        { name: "bcc", label: "BCC", required: false },
        { name: "subject", label: "Subject", required: true },
        { name: "body", label: "", required: true, multiline: true, rows: 10 },
      ];
      break;
    case "Twitter":
      fields = [
        {
          name: "sender",
          label: "Handle",
          required: true,
          type: "select",
          options: platform.identifiers.map((data) => ({
            label: data,
            value: data,
          })),
          defaultValue: platform.identifiers[0] || "",
        },
        {
          name: "status",
          label: "What is happening?",
          required: true,
          multiline: true,
          rows: 8,
        },
      ];
      break;
    case "Telegram":
      fields = [
        { name: "to", label: "To (Phone Number)", required: true, type: "tel" },
        {
          name: "message",
          label: "Message",
          required: true,
          multiline: true,
          rows: 8,
        },
      ];
      break;
    default:
      fields = [];
  }

  setDisplayPanel(
    <DisplayPanel
      header={`Compose ${platform.name}`}
      body={
        <ComposeView onClose={() => setDisplayPanel(null)}>
          <ComposeForm fields={fields} onSubmit={handleFormSubmit} />
        </ComposeView>
      }
    />
  );
};

export const handlePlatformComposeSelect = async ({
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel
      title="Compose"
      element={<ServiceList serviceType="Platform" loading={true} />}
    />
  );

  const [availablePlatforms] = await Promise.all([fetchPlatforms()]);

  const storedTokens = [
    {
      account_identifier: "example@gmail.com",
      platform: "gmail",
    },
    {
      account_identifier: "example2@gmail.com",
      platform: "gmail",
    },
    {
      account_identifier: "my_x_handle",
      platform: "twitter",
    },
  ];

  const tokenMap = storedTokens.reduce((acc, token) => {
    const platformKey = token.platform.toLowerCase();
    if (!acc[platformKey]) acc[platformKey] = [];
    acc[platformKey].push(token.account_identifier);
    return acc;
  }, {});

  const filteredPlatforms = availablePlatforms
    .filter((platform) => tokenMap[platform.name.toLowerCase()])
    .map((platform) => ({
      ...platform,
      identifiers: tokenMap[platform.name.toLowerCase()] || [],
    }));

  setControlPanel(
    <ControlPanel
      title="Compose"
      element={
        <ServiceList
          serviceType="Platform"
          services={filteredPlatforms}
          onClick={(platform) =>
            handlePlatformComposeClick({ setDisplayPanel, platform })
          }
        />
      }
    />
  );
};

export const handleAddAccountSelect = async ({
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setDisplayPanel(null);
  try {
    const fetchedPlatforms = await fetchPlatforms();
    console.log(fetchedPlatforms);
    setControlPanel(
      <ControlPanel
        title="Compose"
        element={
          <ServiceList
            serviceType="Platform"
            services={fetchedPlatforms}
            onClick={(platform) =>
              handlePlatformComposeClick({ setDisplayPanel, platform })
            }
          />
        }
      />
    );
  } catch (err) {
    setAlert({
      open: true,
      message: `Error fetching platforms: ${err}`,
      severity: "error",
    });
  }
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
  const messageController = new MessageController("platformMessages");

  messageController.createMessage({
    avatar: "./gmail.png",
    title: "System Update",
    text: "Your system update was successful.",
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
            handlePlatformMessageClick(setDisplayPanel, message)
          }
        />
      }
    />
  );
};

export const handlePlatformSettingsSelect = ({
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
      name: "Revoke Platforms",
      action: () => setDisplayPanel(<DisplayPanel body={"Revoke Platforms"} />),
    },
    {
      name: "Change Password",
      action: () =>
        setDisplayPanel(
          <DisplayPanel
            header={"Change Password"}
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
                    {
                      name: "newPassword",
                      label: "New Password",
                      required: true,
                      type: "password",
                    },
                    {
                      name: "confirmPassword",
                      label: "Confirm New Password",
                      required: true,
                      type: "password",
                    },
                  ]}
                  activity="change"
                  onSubmit={(data) =>
                    console.log("Password form submitted:", data)
                  }
                />
              </SettingView>
            }
          />
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
