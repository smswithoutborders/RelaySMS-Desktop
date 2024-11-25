import { capitalizeFirstLetter } from "../lib/utils";
import { UserController, SettingsController, sendSms } from ".";

export const fetchBridges = async ({ name, shortcode } = {}) => {
  try {
    const response = await fetch("bridges_resources/bridges.json");
    const bridgesData = await response.json();

    const filteredBridges = bridgesData.filter((bridge) => {
      const matchesName = name
        ? bridge.name.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesShortcode = shortcode
        ? bridge.shortcode && bridge.shortcode.includes(shortcode)
        : true;

      return matchesName || matchesShortcode;
    });

    const updatedBridges = filteredBridges.map((bridge) => ({
      ...bridge,
      name: capitalizeFirstLetter(bridge.name),
      avatar: `./bridges_resources/icons/${bridge.name}.png`,
    }));

    return updatedBridges;
  } catch (error) {
    console.error("Error loading bridges.json:", error);
    throw error;
  }
};

const generateKeyPair = async () => {
  const response = await window.api.invoke("generate-keypair");
  return response;
};

export const createBridgeEntity = async ({ ownershipProofResponse }) => {
  const userController = new UserController();
  const settingsController = new SettingsController();

  try {
    let res;

    if (ownershipProofResponse) {
      const normalizedResponse = ownershipProofResponse
        .replace(/\s+/g, " ")
        .trim();
      const regex = /RelaySMS.*?(\d+)\s+(\S+)/i;
      const match = normalizedResponse.match(regex);

      let otpCode, authPhrase;

      if (match) {
        otpCode = match[1];
        authPhrase = match[2];
      } else {
        const parts = normalizedResponse.split(" ");
        if (parts.length >= 2) {
          otpCode = parts[0];
          authPhrase = parts.slice(1).join(" ");
        } else {
          throw new Error("Invalid ownership proof format.");
        }
      }

      const { serverPublishPublicKey } = await window.api.invoke(
        "extract-bridge-payload",
        { content: authPhrase }
      );

      const publishKeypairs = await userController.getData("keypairs.publish");
      await userController.setData("keypairs", {
        publish: {
          ...publishKeypairs,
          server: {
            publicKey: serverPublishPublicKey,
          },
        },
      });

      await settingsController.setData("preferences.otp.bridge", otpCode);

      res = { message: "Ownership proof verified." };
    } else {
      const clientPublishKeypair = await generateKeyPair();

      await userController.setData("keypairs", {
        publish: {
          client: clientPublishKeypair,
        },
      });

      const payload = await createBridgeTransmissionPayload({
        contentSwitch: 0,
        clientPublishPublicKey: clientPublishKeypair.publicKey,
      });

      const response = await sendSms({ smsPayload: payload });

      if (response.err) {
        throw new Error(response.err);
      }
      res = { message: "Auth phrase requested via SMS." };
    }

    return { err: null, res };
  } catch (error) {
    console.error("Failed to create bridge entity.", error);
    return { err: error.message, res: null };
  }
};

export const encryptBridgePayload = async (content) => {
  const userController = new UserController();

  try {
    const publishDKeypairs = await userController.getData("keypairs.publish");

    const publishSecretKey = await window.api.invoke("derive-secret-key", {
      clientPublishPrivateKey: publishDKeypairs.client.privateKey,
      serverPublishPublicKey: publishDKeypairs.server.publicKey,
    });

    const encryptedPayload = await window.api.invoke("encrypt-payload", {
      content,
      identifier: publishDKeypairs.client.publicKey,
      publishSecretKey,
      serverPublishPublicKey: publishDKeypairs.server.publicKey,
    });

    return encryptedPayload;
  } catch (error) {
    console.error("Failed to encrypt payload:", error);
    throw error;
  }
};

export const createBridgeTransmissionPayload = async ({
  contentSwitch,
  authorizationCode = null,
  contentCiphertext = null,
  bridgeShortCode = null,
  clientPublishPublicKey = null,
  deviceID = null,
}) => {
  try {
    const payload = await window.api.invoke(
      "create-bridge-transmission-payload",
      {
        contentSwitch,
        authorizationCode,
        contentCiphertext,
        bridgeShortCode,
        clientPublishPublicKey,
        deviceID,
      }
    );

    return payload;
  } catch (error) {
    console.error(`Failed to create transmission payload: ${error}`);
    throw error;
  }
};
