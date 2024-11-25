import { DisplayPanel, ControlPanel, SMSMessageList } from "../Components";
import { SMSMessageView } from "../Views";
import { fetchSmsMessages } from "../controllers";

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
