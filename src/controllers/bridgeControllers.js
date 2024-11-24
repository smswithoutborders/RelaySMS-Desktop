import { extractRpcErrorMessage, capitalizeFirstLetter } from "../lib/utils";
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

export const createBridgeEntity = async ({ ownership_proof_response }) => {
  const userController = new UserController();
  const settingsController = new SettingsController();

  let response;

  if (ownership_proof_response) {
    const server_publish_pub_key = "";
    await userController.setData("keypairs", {
      publish: {
        server: { publicKey: server_publish_pub_key },
      },
    });
    await settingsController.setData("preferences.otp.bridge", "");
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

    console.log(">>>>>", payload);

    // response = await sendSms({ smsPayload: payload });
    response = { err: null, res: true };
  }

  return response;
};

export const encryptPayload = async (content) => {
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
  authorizationCode = "",
  contentCiphertext = "",
  bridgeShortCode = "",
  clientPublishPublicKey = "",
  deviceID = "",
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
