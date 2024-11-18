import { extractRpcErrorMessage, capitalizeFirstLetter } from "../lib/utils";
import { generateKeyPair } from "../lib/crypto";
import { UserController, SettingsController } from "./";

export const fetchPlatforms = async ({ name, shortcode } = {}) => {
  try {
    const response = await fetch("/platforms_resources/platforms.json");
    const platformsData = await response.json();

    const filteredPlatforms = platformsData.filter((platform) => {
      const matchesName = name
        ? platform.name.toLowerCase().includes(name.toLowerCase())
        : true;
      const matchesShortcode = shortcode
        ? platform.shortcode && platform.shortcode.includes(shortcode)
        : true;

      return matchesName || matchesShortcode;
    });

    const updatedPlatforms = filteredPlatforms.map((platform) => ({
      ...platform,
      name: capitalizeFirstLetter(platform.name),
      avatar: `./platforms_resources/icons/${platform.name}.png`,
    }));

    return updatedPlatforms;
  } catch (error) {
    console.error("Error loading platforms.json:", error);
    throw error;
  }
};

export const createEntity = async ({
  country_code,
  phone_number,
  password,
  ownership_proof_response,
}) => {
  const clientPublishKeypair = generateKeyPair();
  const clientDeviceIDKeypair = generateKeyPair();

  const request = {
    country_code,
    phone_number,
    password,
    client_publish_pub_key: clientPublishKeypair.publicKey,
    client_device_id_pub_key: clientDeviceIDKeypair.publicKey,
    ownership_proof_response,
  };

  try {
    const response = await window.api.invoke("CreateEntity", request);
    console.log("CreateEntity Response:", response);

    const userController = new UserController();
    const settingsController = new SettingsController();

    const operations = [];

    if (response.long_lived_token) {
      operations.push(
        userController.setData("keypairs", {
          publish: {
            client: clientPublishKeypair,
            server: { publicKey: response.server_publish_pub_key },
          },
          deviceID: {
            client: clientDeviceIDKeypair,
            server: { publicKey: response.server_device_id_pub_key },
          },
        }),
        userController.setData("longLivedToken", response.long_lived_token),
        settingsController.deleteData("preferences.otp.nextAttemptTimestamp"),
        settingsController.deleteData("preferences.otp.phoneNumber")
      );
    }

    if (response.requires_ownership_proof) {
      operations.push(
        settingsController.setData("preferences.otp.phoneNumber", phone_number),
        settingsController.setData(
          "preferences.otp.nextAttemptTimestamp",
          response.next_attempt_timestamp
        )
      );
    }

    await Promise.all(operations);

    return { err: null, res: response };
  } catch (error) {
    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    console.error(extractedError);
    return { err: extractedError, res: null };
  }
};

export const authenticateEntity = async ({
  phone_number,
  password,
  ownership_proof_response,
}) => {
  const clientPublishKeypair = generateKeyPair();
  const clientDeviceIDKeypair = generateKeyPair();

  const request = {
    phone_number,
    password,
    client_publish_pub_key: clientPublishKeypair.publicKey,
    client_device_id_pub_key: clientDeviceIDKeypair.publicKey,
    ownership_proof_response,
  };

  try {
    const response = await window.api.invoke("AuthenticateEntity", request);
    console.log("AuthenticateEntity Response:", response);

    const userController = new UserController();
    const settingsController = new SettingsController();

    const operations = [];

    if (response.long_lived_token) {
      operations.push(
        userController.setData("keypairs", {
          publish: {
            client: clientPublishKeypair,
            server: { publicKey: response.server_publish_pub_key },
          },
          deviceID: {
            client: clientDeviceIDKeypair,
            server: { publicKey: response.server_device_id_pub_key },
          },
        }),
        userController.setData("longLivedToken", response.long_lived_token),
        settingsController.deleteData("preferences.otp.nextAttemptTimestamp"),
        settingsController.deleteData("preferences.otp.phoneNumber")
      );
    }

    if (response.requires_ownership_proof) {
      operations.push(
        settingsController.setData("preferences.otp.phoneNumber", phone_number),
        settingsController.setData(
          "preferences.otp.nextAttemptTimestamp",
          response.next_attempt_timestamp
        )
      );
    }

    await Promise.all(operations);

    return { err: null, res: response };
  } catch (error) {
    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    console.error(extractedError);
    return { err: extractedError, res: null };
  }
};
