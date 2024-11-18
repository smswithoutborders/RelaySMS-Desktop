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

    if (response.long_lived_token) {
      userController.setUserData({
        keypairs: {
          publish: {
            client: clientPublishKeypair,
            server: { publicKey: response.server_publish_pub_key },
          },
          deviceID: {
            client: clientDeviceIDKeypair,
            server: { publicKey: response.server_device_id_pub_key },
          },
        },
        longLivedToken: response.long_lived_token,
      });
      settingsController.deleteSetting("preferences.otp.nextAttemptTimestamp");
      settingsController.deleteSetting("preferences.otp.phoneNumber");
    }

    if (response.requires_ownership_proof) {
      settingsController.setSetting(
        "preferences.otp.phoneNumber",
        phone_number
      );
      settingsController.setSetting(
        "preferences.otp.nextAttemptTimestamp",
        response.next_attempt_timestamp
      );
    }
    return { err: null, res: response };
  } catch (error) {
    const extractedError = extractRpcErrorMessage(error.message);

    if (!extractedError) {
      console.error(error);
    } else {
      console.error(extractedError);
    }
    return {
      err:
        extractedError || "Oops, something went wrong. Please try again later.",
      res: null,
    };
  }
};
