import { SettingsController } from "./";

export const fetchGatewayClients = async () => {
  const settingsController = new SettingsController();

  try {
    const response = await fetch(
      "https://gatewayserver.smswithoutborders.com/v3/clients",
      {
        timeout: 8000,
      }
    );
    const gatewayClients = await response.json();
    const currentGatewayClients =
      (await settingsController.getData("gatewayclients")) || [];
    const updatedGatewayClients = gatewayClients.map((client) => {
      const currentClient = currentGatewayClients.find(
        (existingClient) => existingClient.msisdn === client.msisdn
      );
      return {
        ...client,
        active: currentClient ? currentClient.active : false,
        default:
          client.country && client.country.toLowerCase() === "usa"
            ? true
            : false,
      };
    });
    await settingsController.setData("gatewayclients", updatedGatewayClients);
    return updatedGatewayClients;
  } catch (error) {
    console.error("Error fetching gateway clients:", error);

    const storedGatewayClients = await settingsController.getData(
      "gatewayclients"
    );
    return storedGatewayClients || [];
  }
};

export const checkState = async () => {
  try {
    const response = await fetch("http://localhost:6868/system/state", {
      timeout: 8000,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch system state: ${response.statusText}`);
    }
    const state = await response.json();
    return state;
  } catch (error) {
    console.error("Error fetching system state:", error.message);
    return null;
  }
};

export const fetchModems = async () => {
  try {
    const response = await fetch("http://localhost:6868/modems", {
      timeout: 8000,
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch modems: ${response.statusText}`);
    }
    const modems = await response.json();
    return modems;
  } catch (error) {
    console.error("Error fetching modems:", error.message);
    return [];
  }
};

export const sendSms = async ({ smsPayload }) => {
  try {
    const state = await checkState();

    if (!state || state.outbound !== "active") {
      return {
        err: "No active gateway client setup found. Please configure the system and try again.",
        res: null,
      };
    }

    const modems = await fetchModems();

    if (modems.length === 0) {
      return {
        err: "No active modem found on the system. Please connect a modem and try again.",
        res: null,
      };
    }

    const firstModemIndex = modems[0].index;

    const response = await fetch(
      `http://localhost:6868/modems/${firstModemIndex}/sms`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(smsPayload),
        timeout: 8000,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to send SMS: ${response.statusText}`);
    }

    const result = await response.text();
    return { err: null, res: result };
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    return { err: error.message, res: null };
  }
};
