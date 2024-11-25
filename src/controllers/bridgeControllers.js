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

export const createBridgeEntity = async ({ ownershipProofResponse }) => {
  const userController = new UserController();
  const settingsController = new SettingsController();

  const setPublishKeyData = async (type, keyData) => {
    await userController.setData("keypairs", {
      publish: { [type]: keyData },
    });
  };

  try {
    if (ownershipProofResponse) {
      const [otpCode, authPhrase] = ownershipProofResponse.split(" ");

      const { serverPublishPublicKey } = await window.api.invoke(
        "extract-bridge-payload",
        { content: authPhrase }
      );

      await setPublishKeyData("server", { publicKey: serverPublishPublicKey });
      await settingsController.setData("preferences.otp.bridge", otpCode);
    } else {
      const clientPublishKeypair = await generateKeyPair();

      await setPublishKeyData("client", clientPublishKeypair);

      const payload = await createBridgeTransmissionPayload({
        contentSwitch: 0,
        clientPublishPublicKey: clientPublishKeypair.publicKey,
      });

      console.log("Generated Payload:", payload);

      // response = await sendSms({ smsPayload: payload });

      return { err: null, res: true };
    }
  } catch (error) {
    console.error("Failed to create bridge entity.", error);
    return { err: error, res: null };
  }
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
