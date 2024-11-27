import { Launch } from "@mui/icons-material";
import { DisplayPanel, ControlPanel, SMSMessageList, ItemsList } from "../Components";
import { SMSMessageView } from "../Views";
import { fetchSmsMessages } from "../controllers";
import ThemeToggle from "../Components/ThemeToggle";
import LanguageList from "../Components/LanguageList";

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

const handleSmsMessageClick = ({ setDisplayPanel, selectedGroup }) => {
  setDisplayPanel(
    <DisplayPanel
      header={selectedGroup.title}
      body={<SMSMessageView selectedGroup={selectedGroup} />}
    />
  );
};

export const handleSmsMessageSelect = async ({
  setControlPanel,
  setDisplayPanel,
  setAlert,
}) => {
  setDisplayPanel(null);
  setControlPanel(
    <ControlPanel
      title="SMS Messages"
      element={<SMSMessageList messages={[]} loading={true} />}
    />
  );

  const { err, messages } = await fetchSmsMessages();

  if (err) {
    setAlert({
      open: true,
      severity: "error",
      message: err,
    });
  }

  const updatedMessages = messages.map((message) => {
    return {
      ...message,
      title: message.number,
      date: new Date(
        message.timestamp.replace(/([+-]\d{2})$/, "$1:00")
      ).toISOString(),
      index: message.id,
    };
  });

  setControlPanel(
    <ControlPanel
      title="SMS Messages"
      element={
        <SMSMessageList
          messages={updatedMessages}
          onClick={(selectedGroup) =>
            handleSmsMessageClick({ setDisplayPanel, selectedGroup })
          }
        />
      }
    />
  );
};


export const handleDekuHelpSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setControlPanel,
  setAlert,
}) => {
  const handleOpenExternalLink = (url) => {
    window.api.send("open-external-link", url);
  };

  const help = [
    {
      name: "Telegram",
      action: () =>
        handleOpenExternalLink("https://t.me/deku_sms"),
      icon: <Launch />,
    },
    {
      name: "GitHub",
      action: () =>
        handleOpenExternalLink("https://github.com/dekusms"),
      icon: <Launch />,
    },
   
  ];

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel title="Help" element={<ItemsList items={help} />} />
  );
};

const handleLanguageSelect = ({ setDisplayPanel }) => {
  setDisplayPanel(
    <DisplayPanel header={"Select Language"} body={<LanguageList />} />
  );
};

export const handleDekuSettingsSelect = ({
  actionName,
  currentActionRef,
  setDisplayPanel,
  setControlPanel,
  setAlert,
}) => {
  const settings = [
    {
      name: "Select Language",
      action: () => handleLanguageSelect({ setDisplayPanel }),
    },
  ];

  if (currentActionRef.current !== actionName) return;

  setControlPanel(
    <ControlPanel
      title="Settings"
      element={
        <>
          <ItemsList items={settings} /> <ThemeToggle />{" "}
        </>
      }
    />
  );
};