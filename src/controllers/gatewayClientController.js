import { SettingsController } from "./";

export const fetchGatewayClients = async () => {
  const settingsController = new SettingsController();

  const setDefaultFlag = (client) =>
    client.country && client.country.toLowerCase() === "usa";

  let updatedGatewayClients = [];
  let defaultGatewayClients = [];
  let storedGatewayClients = [];

  try {
    // Load stored clients from storage
    storedGatewayClients =
      (await settingsController.getData("gatewayclients")) || [];

    // Step 1: If no stored clients exist, load local clients (default data)
    if (storedGatewayClients.length === 0) {
      const defaultResponse = await fetch("gateway_clients.json");
      if (!defaultResponse.ok) {
        throw new Error("Failed to fetch default gateway clients");
      }
      defaultGatewayClients = await defaultResponse.json();

      // Sync default clients and store them in storage
      updatedGatewayClients = defaultGatewayClients.map((client) => ({
        ...client,
        default: setDefaultFlag(client),
        verified: true, // Marking local clients as verified
      }));

      // Store the default clients in case no live data is fetched
      await settingsController.setData("gatewayclients", updatedGatewayClients);
    } else {
      // If stored clients already exist, use them
      updatedGatewayClients = storedGatewayClients;
    }

    // Step 2: Now, fetch live gateway clients
    try {
      const response = await fetch(
        "https://gatewayserver.smswithoutborders.com/v3/clients",
        { timeout: 6000 }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch live gateway clients");
      }

      const liveGatewayClients = await response.json();

      // Step 3: Compare live clients to stored clients
      const liveClientMap = new Map(
        liveGatewayClients.map((client) => [client.msisdn, client])
      );

      // Step 4: Overwrite everything with live client data
      updatedGatewayClients = liveGatewayClients.map((client) => {
        const storedClient = storedGatewayClients.find(
          (existingClient) => existingClient.msisdn === client.msisdn
        );

        return {
          ...client, // Live client takes priority
          active: storedClient ? storedClient.active : false, // Maintain active state from storage
          default: setDefaultFlag(client), // Set default flag
          verified: true, // Live clients are verified
        };
      });

      // Step 5: Any local clients not present in live data should be removed
      updatedGatewayClients = updatedGatewayClients.filter((client) =>
        liveClientMap.has(client.msisdn)
      );

      // Step 6: Store live clients in storage
      await settingsController.setData("gatewayclients", updatedGatewayClients);
    } catch (liveError) {
      console.warn(
        "Failed to fetch live clients, using fallback data:",
        liveError
      );

      // Step 7: If live fetch fails and stored clients exist, use them as is
      if (storedGatewayClients.length > 0) {
        updatedGatewayClients = storedGatewayClients;
      }
      // If no live data and stored clients are empty, keep the local clients already set
    }
  } catch (error) {
    console.error("Error initializing gateway clients:", error);

    // Final fallback: If all else fails, return stored clients (or empty if none)
    updatedGatewayClients = storedGatewayClients;
  }

  return updatedGatewayClients;
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

export const fetchSmsMessages = async () => {
  try {
    const state = await checkState();

    if (!state || state.inbound !== "active") {
      return {
        err: "No active gateway client setup found. Please configure the system and try again.",
        messages: [],
      };
    }

    const modems = await fetchModems();

    if (modems.length === 0) {
      return {
        err: "No active modems found on the system.",
        messages: [],
      };
    }

    const firstModemIndex = modems[0].index;
    const response = await fetch(
      `http://localhost:6868/modems/${firstModemIndex}/sms`,
      {
        timeout: 8000,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch SMS messages: ${response.statusText}`);
    }

    const messages = await response.json();
    return { err: null, messages };
  } catch (error) {
    console.error("Error fetching SMS messages:", error.message);
    return { err: error.message, messages: [] };
  }
};

export const fetchLatestMessageWithOtp = async ({
  phoneNumbers,
  messagePatterns,
}) => {
  try {
    const { err, messages } = await fetchSmsMessages();

    if (err) {
      return { err, message: null };
    }

    const matchingMessages = messages.filter((message) => {
      const matchedPhoneNumbers = phoneNumbers.filter((phone) =>
        message.number.includes(phone)
      );

      const matchedOtps = messagePatterns
        .map((pattern) => message.text.match(pattern))
        .filter((otpMatch) => otpMatch);

      return matchedPhoneNumbers.length > 0 && matchedOtps.length > 0;
    });

    if (matchingMessages.length === 0) {
      return { err: null, message: null };
    }

    const sortedMessages = matchingMessages.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );

    const latestMessage = sortedMessages[0];

    const matchedOtps = messagePatterns
      .map((pattern) => latestMessage.text.match(pattern))
      .filter((otpMatch) => otpMatch);
    const otp = matchedOtps.length > 0 ? matchedOtps[0][0] : null;

    return {
      err: null,
      message: {
        phoneNumbers: phoneNumbers.filter((phone) =>
          latestMessage.number.includes(phone)
        ),
        otp,
        content: latestMessage.text,
        timestamp: latestMessage.timestamp,
        number: latestMessage.number,
        index: latestMessage.index,
      },
    };
  } catch (error) {
    console.error("Error processing SMS messages:", error.message);
    return { err: error.message, message: null };
  }
};

export const deleteSmsMessage = async (modemIndex, smsIndex) => {
  try {
    const response = await fetch(
      `http://localhost:6868/modems/${modemIndex}/sms/${smsIndex}`,
      {
        method: "DELETE",
        timeout: 8000,
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete SMS message: ${response.statusText}`);
    }

    const result = await response.text();
    return { err: null, res: result };
  } catch (error) {
    console.error("Error deleting SMS message:", error.message);
    return { err: error.message, res: null };
  }
};
