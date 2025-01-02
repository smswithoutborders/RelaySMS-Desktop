import i18next from "i18next";
import {
  DisplayPanel,
  ControlPanel,
  ServiceList,
  GatewayClientList,
  MessageList,
  ItemsList,
} from "../Components";
import { ComposeForm } from "../Forms";
import { DialogView, ComposeView } from "../Views";
import {
  fetchGatewayClients,
  sendSms,
  encryptBridgePayload,
  fetchBridges,
  createBridgeTransmissionPayload,
  UserController,
  MessageController,
  SettingsController,
} from "../controllers";

const languages = [
  { name: "English" },
  { name: "French" },
  { name: "Persian" },
  { name: "Spanish" },
  { name: "Turkish" },
];

export const executeSelect = async ({
  actionName,
  selectFunction,
  setControlPanel,
  setDisplayPanel,
  setAlert,
  currentActionRef,
}) => {
  if (currentActionRef.current !== actionName) {
    currentActionRef.current = actionName;
  } else {
    return;
  }

  setDisplayPanel(null);

  await selectFunction({
    actionName,
    currentActionRef,
    setControlPanel,
    setDisplayPanel,
    setAlert,
  });

  if (currentActionRef.current === actionName) {
    currentActionRef.current = null;
  }
};

export const handleBridgeComposeClick = ({
  setDisplayPanel,
  setAlert,
  bridge,
}) => {
  const messageController = new MessageController();
  const settingsController = new SettingsController();

  const handleFormSubmit = async (data) => {
    try {
      const gatewayClients = await fetchGatewayClients();

      const activeGatewayClient = gatewayClients.find(
        (client) => client.active === true
      );

      if (!activeGatewayClient) {
        setAlert({
          open: true,
          severity: "error",
          message:
            "No active gateway client selected. Please select one and try again.",
        });
        return;
      }

      let structuredContent;

      switch (bridge.name) {
        case "Email Bridge":
          structuredContent = `${data.to}:${data.cc}:${data.bcc}:${data.subject}:${data.body}`;
          break;

        default:
          setAlert({
            open: true,
            severity: "error",
            message: `Unsupported service type: ${bridge.name}`,
          });
          return;
      }

      const authorizationCode = await settingsController.getData(
        "preferences.otp.bridge"
      );

      const contentCiphertext = await encryptBridgePayload(structuredContent);
      const transmissionPayload = await createBridgeTransmissionPayload({
        contentCiphertext,
        authorizationCode,
        contentSwitch: authorizationCode ? 2 : 3,
        bridgeShortCode: bridge.shortcode,
      });

      const smsPayload = {
        number: activeGatewayClient.msisdn,
        text: transmissionPayload,
      };

      const { err } = await sendSms({ smsPayload });

      if (err) {
        setAlert({
          open: true,
          severity: "error",
          message: err,
        });
        return;
      }

      const existingMessages =
        (await messageController.getData("relaysms")) || [];
      const newMessage = {
        raw: data,
        bridge: bridge,
        avatar: bridge.avatar,
        id: existingMessages.length + 1,
        text: data.body,
        title: data.subject,
        date: new Date().toISOString(),
      };

      const updatedMessages = [...existingMessages, newMessage];
      await messageController.setData("relaysms", updatedMessages);

      setDisplayPanel(null);

      setAlert({
        open: true,
        severity: "success",
        message: "Message is ready and queued for sending.",
      });
    } catch (error) {
      setAlert({
        open: true,
        severity: "error",
        message: "Oops, something went wrong. Please try again later.",
      });
    }
  };

  let fields;

  switch (bridge.name) {
    case "Email Bridge":
      fields = [
        { name: "to", label: "To", required: true, type: "email" },
        { name: "cc", label: "Cc", required: false },
        { name: "bcc", label: "BCC", required: false },
        { name: "subject", label: "Subject", required: true },
        { name: "body", label: "", required: true, multiline: true, rows: 10 },
      ];
      break;
    default:
      fields = [];
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

export const handleBridgeComposeSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Compose"
      element={<ServiceList serviceType="Bridge" loading={true} />}
    />
  );

  const availableBridges = await fetchBridges();

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel
      title="Compose"
      element={
        <ServiceList
          serviceType="Bridge"
          services={availableBridges}
          onClick={(bridge) =>
            handleBridgeComposeClick({ setDisplayPanel, setAlert, bridge })
          }
        />
      }
    />
  );
};

const handleGatewayClientToggle = async ({ client, setAlert }) => {
  const settingsController = new SettingsController();

  const currentGatewayClients =
    (await settingsController.getData("gatewayclients")) || [];

  const updatedGatewayClients = currentGatewayClients.map((existingClient) =>
    existingClient.msisdn === client.msisdn
      ? { ...client, active: true }
      : { ...existingClient, active: false }
  );

  await settingsController.setData("gatewayclients", updatedGatewayClients);

  setAlert({
    open: true,
    message: `Gateway client ${client.msisdn} is now active.`,
    severity: "success",
  });
};

export const handleGatewayClientSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Gateway Clients"
      element={<GatewayClientList items={[]} loading={true} />}
    />
  );

  const gatewayClients = await fetchGatewayClients();

  if (currentActionRef.current !== actionName) return;

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

const handleBridgeMessageClick = (setDisplayPanel, message) => {
  setDisplayPanel(
    <DisplayPanel header={message.title} body={<div>{message.text}</div>} />
  );
};

export const handleBridgeMessageSelect = async ({
  actionName,
  currentActionRef,
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setControlPanel(
    <ControlPanel
      title="Messages"
      element={<MessageList messages={[]} loading={true} />}
    />
  );

  const messageController = new MessageController();
  const messages = (await messageController.getData("relaysms")) || [];

  if (currentActionRef.current !== actionName) return;

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

const handleLanguageSelect = ({ setDisplayPanel }) => {
  setDisplayPanel(
    <DisplayPanel
      body={
        <ItemsList
          items={languages}
          onSelect={async (selectedLanguage) => {
            await i18next.changeLanguage(selectedLanguage.toLowerCase());
            setDisplayPanel(null); // Close the language selection menu
          }}
        />
      }
    />
  );
};

const handleLogoutSelect = ({ setDisplayPanel }) => {
  const messageController = new MessageController();
  const userController = new UserController();
  const settingsController = new SettingsController();

  const logout = {
    title: "Confirm Logout",
    description:
      "Are you sure you want to log out? You will need to log in again to continue using the app. This action cannot be undone.",
    color: "",
  };

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
          onConfirm={async () => {
            await new Promise((resolve) => {
              setTimeout(async () => {
                await Promise.all([
                  window.api.invoke("clear-ratchet-state"),
                  messageController.deleteTable(),
                  userController.deleteTable(),
                  settingsController.deleteData("preferences.otp.bridge"),
                ]);

                await window.api.invoke("reload-window");
                resolve();
              }, 2000);
            });
          }}
        />
      }
    />
  );
};

export const handleBridgeSettingsSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setControlPanel,
}) => {
  const settings = [
    {
      name: "Language",
      action: () => handleLanguageSelect({ setDisplayPanel }),
    },
    {
      name: "Log out",
      action: () => handleLogoutSelect({ setDisplayPanel }),
    },
  ];

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel title="Settings" element={<ItemsList items={settings} />} />
  );
};
