import {
    DisplayPanel,
    ControlPanel,
    GatewayClientList,
    MessageList,
    ItemsList,
    ServiceList,
  } from "../Components";
  import { ComposeForm} from "../Forms";
  import { ComposeView } from "../Views";
  import { MessageController } from "../controllers";
  
  const languages = [
    { name: "English" },
    { name: "French" },
    { name: "Persian" },
    { name: "Spanish" },
    { name: "Turkish" },
  ];
  
  
  export const handleBridgeMessageClick = (setDisplayPanel, message) => {
    setDisplayPanel(
      <DisplayPanel header={message.title} body={<div>{message.text}</div>} />
    );
  };
  
  export const handleModemToggle = ({ client, setAlert }) => {
    setAlert({
      open: true,
      message: client.key,
      severity: "info",
    });
  };
  
  export const handleDekuComposeSelect = ({
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
            serviceType="Deku"
            services={bridges}
            onClick={(bridge) =>
              handleDekuComposeClick({ setDisplayPanel, bridge })
            }
          />
        }
      />
    );
  };
  
  export const handleDekuComposeClick = ({ setDisplayPanel, bridge }) => {
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
  
  export const handleModemSelect = ({
    setControlPanel,
    setDisplayPanel,
    setAlert,
  }) => {
    const modems = [
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
            items={modems}
            onSelect={(client) => handleModemToggle({ client, setAlert })}
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
    const messageController = new MessageController("smsMessages");
  
    messageController.createMessage({
      avatar: "",
      title: "MTN",
      text: "Your NJOH data is now available, dial #000#",
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
  
  export const handleDekuSettingsSelect = ({
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
    ];
  
    setDisplayPanel(null);
    setControlPanel(
      <ControlPanel title="Settings" element={<ItemsList items={settings} />} />
    );
  };
  