import DisplayPanel from "../Components/DisplayPanel";
import ControlPanel from "../Components/ControlPanel";
import ServiceList from "../Components/ServiceList";
import GatewayClientList from "../Components/GatewayClientList";
import ItemsList from "../Components/ItemsList";
import ComposeView from "../Views/ComposeView";
import ComposeForm from "../Forms/ComposeForm";
import fetchPlatforms from "../controllers/platformControllers";

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
    alert(`Form submitted with data: ${JSON.stringify(data)}`);
    setDisplayPanel(null);
  };

  let fields = [];

  if (platform.name === "Gmail") {
    fields = [
      { name: "from", label: "From", required: true, type: "email" },
      { name: "to", label: "To", required: true, type: "email" },
      { name: "cc", label: "Cc", required: false },
      { name: "bcc", label: "BCC", required: false },
      { name: "subject", label: "Subject", required: true },
      { name: "body", label: "", required: true, multiline: true, rows: 10 },
    ];
  } else if (platform.name === "Twitter") {
    fields = [
      {
        name: "status",
        label: "What is happening?",
        required: true,
        multiline: true,
        rows: 8,
      },
    ];
  } else if (platform.name === "Telegram") {
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
  }

  setDisplayPanel(
    <DisplayPanel
      header={`Compose ${platform.name}`}
      body={
        <ComposeView
          formComponent={
            <ComposeForm fields={fields} onSubmit={handleFormSubmit} />
          }
          onClose={() => setDisplayPanel(null)}
        />
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
  try {
    const fetchedPlatforms = await fetchPlatforms();
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

export const handlePlatformSettingsSelect = ({
  setDisplayPanel,
  setControlPanel,
}) => {
  const settings = [
    {
      name: "Language",
      action: () => setDisplayPanel(<DisplayPanel body={"Change Language"} />),
    },
    {
      name: "Revoke Platforms",
      action: () => setDisplayPanel(<DisplayPanel body={"Revoke Platforms"} />),
    },
    {
      name: "Reset Password",
      action: () => setDisplayPanel(<DisplayPanel body={"Reset Password"} />),
    },
    {
      name: "Log out",
      action: () => setDisplayPanel(<DisplayPanel body={"Log out"} />),
    },
    {
      name: "Delete Account",
      action: () => setDisplayPanel(<DisplayPanel body={"Delete Account"} />),
    },
  ];

  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel title="Settings" element={<ItemsList items={settings} />} />
  );
};
