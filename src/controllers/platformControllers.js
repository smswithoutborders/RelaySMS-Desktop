import { extractRpcErrorMessage, capitalizeFirstLetter } from "../lib/utils";
import { UserController, SettingsController, MessageController } from "./";

export const fetchPlatforms = async ({ name, shortcode } = {}) => {
  try {
    const response = await fetch("platforms_resources/platforms.json");
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

const generateKeyPair = async () => {
  const response = await window.api.invoke("generate-keypair");
  return response;
};

export const createEntity = async ({
  country_code,
  phone_number,
  password,
  ownership_proof_response,
}) => {
  const [clientPublishKeypair, clientDeviceIDKeypair] = await Promise.all([
    generateKeyPair(),
    generateKeyPair(),
  ]);

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
        userController.setData("phoneNumber", phone_number),
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
  const [clientPublishKeypair, clientDeviceIDKeypair] = await Promise.all([
    generateKeyPair(),
    generateKeyPair(),
  ]);

  const request = {
    phone_number,
    password,
    client_publish_pub_key: clientPublishKeypair.publicKey,
    client_device_id_pub_key: clientDeviceIDKeypair.publicKey,
    ownership_proof_response,
  };

  try {
    const response = await window.api.invoke("AuthenticateEntity", request);

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
        userController.setData("phoneNumber", phone_number),
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

export const resetPassword = async ({
  phone_number,
  new_password,
  ownership_proof_response,
}) => {
  const [clientPublishKeypair, clientDeviceIDKeypair] = await Promise.all([
    generateKeyPair(),
    generateKeyPair(),
  ]);

  const request = {
    phone_number,
    new_password,
    client_publish_pub_key: clientPublishKeypair.publicKey,
    client_device_id_pub_key: clientDeviceIDKeypair.publicKey,
    ownership_proof_response,
  };

  try {
    const response = await window.api.invoke("ResetPassword", request);

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

export const listEntityStoredTokens = async () => {
  const userController = new UserController();
  const messageController = new MessageController();

  try {
    const hasInternet = await window.api.invoke("check-internet");
    if (!hasInternet) {
      const storedTokens = (await userController.getData("storedTokens")) || [];
      return {
        err: null,
        res: {
          warn: "You're offline. Using stored tokens for now. Don't worry, it's all good!",
          storedTokens,
        },
      };
    }

    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const { stored_tokens: storedTokens = [], ...response } =
      await window.api.invoke("ListEntityStoredTokens", {
        long_lived_token: longLivedToken,
      });

    await userController.setData("storedTokens", storedTokens);

    return {
      err: null,
      res: {
        ...response,
        storedTokens,
      },
    };
  } catch (error) {
    const storedTokens = (await userController.getData("storedTokens")) || [];
    const extractedError =
      extractRpcErrorMessage(error.message) ||
      (error.message.includes("read ECONNRESET")
        ? "Please check your network connection and try again."
        : "Oops, something went wrong. Please try again later.");

    if (error.message.includes("16 UNAUTHENTICATED")) {
      await Promise.all([
        window.api.invoke("clear-ratchet-state"),
        messageController.deleteTable(),
        userController.deleteTable(),
      ]);

      await window.api.invoke("reload-window");
    }

    return {
      err: extractedError,
      res: {
        storedTokens,
      },
    };
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

export const createTransmissionPayload = async ({
  contentCiphertext,
  platformShortCode,
  deviceID = "",
}) => {
  try {
    const payload = await window.api.invoke("create-transmission-payload", {
      contentCiphertext,
      platformShortCode,
      deviceID,
    });

    return payload;
  } catch (error) {
    console.error(`Failed to create transmission payload: ${error}`);
    throw error;
  }
};

export const addOAuth2Token = async ({ platform }) => {
  const userController = new UserController();

  const redirectUrl = `https://oauth.afkanerd.com/platforms/${platform.toLowerCase()}/protocols/oauth2/redirect_codes/`;

  try {
    const { authorization_url, code_verifier } = await window.api.invoke(
      "GetOAuth2AuthorizationUrl",
      {
        platform,
        state: "",
        code_verifier: "",
        autogenerate_code_verifier: true,
        redirect_url: redirectUrl,
      }
    );

    await window.api.invoke("open-oauth-screen", {
      authorizationUrl: authorization_url,
    });

    const authorizationCode = await window.api.once("authorization-code");

    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const response = await window.api.invoke("ExchangeOAuth2CodeAndStore", {
      long_lived_token: longLivedToken,
      platform,
      authorization_code: authorizationCode,
      code_verifier,
      redirect_url: redirectUrl,
    });

    return { err: null, res: response };
  } catch (error) {
    console.error("OAuth2 Add Token Error:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    return { err: extractedError, res: null };
  }
};

export const deleteOAuth2Token = async ({ platform, identifier }) => {
  const userController = new UserController();

  try {
    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const response = await window.api.invoke("RevokeAndDeleteOAuth2Token", {
      long_lived_token: longLivedToken,
      platform,
      account_identifier: identifier,
    });

    return { err: null, res: response };
  } catch (error) {
    console.error("OAuth2 Delete Token Error:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    return { err: extractedError, res: null };
  }
};

export const addPNBAToken = async ({
  platform,
  phoneNumber,
  authorizationCode = "",
  password = "",
}) => {
  const userController = new UserController();

  try {
    let response;

    if (!authorizationCode) {
      response = await window.api.invoke("GetPNBACode", {
        platform,
        phone_number: phoneNumber,
      });
    } else {
      const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
        userController.getData("keypairs.deviceID"),
        userController.getData("longLivedToken"),
      ]);

      const longLivedToken = await window.api.invoke(
        "decrypt-long-lived-token",
        {
          client_device_id_private_key: deviceIDKeypairs.client.privateKey,
          server_device_id_public_key: deviceIDKeypairs.server.publicKey,
          long_lived_token_cipher: longLivedTokenCipher,
        }
      );

      response = await window.api.invoke("ExchangePNBACodeAndStore", {
        long_lived_token: longLivedToken,
        platform,
        authorization_code: authorizationCode,
        phone_number: phoneNumber,
        password,
      });
    }

    return { err: null, res: response };
  } catch (error) {
    console.error("PNBA Add Token Error:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    return { err: extractedError, res: null };
  }
};

export const deletePNBAToken = async ({ platform, identifier }) => {
  const userController = new UserController();

  try {
    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const response = await window.api.invoke("RevokeAndDeletePNBAToken", {
      long_lived_token: longLivedToken,
      platform,
      account_identifier: identifier,
    });

    return { err: null, res: response };
  } catch (error) {
    console.error("PNBA Delete Token Error:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    return { err: extractedError, res: null };
  }
};

export const updateEntityPassword = async ({
  currentPassword,
  newPassword,
}) => {
  const userController = new UserController();

  try {
    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const response = await window.api.invoke("UpdateEntityPassword", {
      current_password: currentPassword,
      long_lived_token: longLivedToken,
      new_password: newPassword,
    });

    return { err: null, res: response };
  } catch (error) {
    console.error("Failed to update entity password:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    console.error(extractedError);
    return { err: extractedError, res: null };
  }
};

export const deleteEntity = async () => {
  const userController = new UserController();

  try {
    const [deviceIDKeypairs, longLivedTokenCipher] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("longLivedToken"),
    ]);

    const longLivedToken = await window.api.invoke("decrypt-long-lived-token", {
      client_device_id_private_key: deviceIDKeypairs.client.privateKey,
      server_device_id_public_key: deviceIDKeypairs.server.publicKey,
      long_lived_token_cipher: longLivedTokenCipher,
    });

    const response = await window.api.invoke("DeleteEntity", {
      long_lived_token: longLivedToken,
    });

    return { err: null, res: response };
  } catch (error) {
    console.error("Failed to delete entity:", error);

    const extractedError =
      extractRpcErrorMessage(error.message) ||
      "Oops, something went wrong. Please try again later.";
    console.error(extractedError);
    return { err: extractedError, res: null };
  }
};

export const computeDeviceID = async () => {
  const userController = new UserController();

  try {
    const [deviceIDKeypairs, phoneNumber] = await Promise.all([
      userController.getData("keypairs.deviceID"),
      userController.getData("phoneNumber"),
    ]);

    const deviceID = await window.api.invoke("compute-device-id", {
      phoneNumber,
      clientDeviceIDPublicKey: deviceIDKeypairs.client.publicKey,
      clientDeviceIdPrivateKey: deviceIDKeypairs.client.privateKey,
      serverDeviceIdPublicKey: deviceIDKeypairs.server.publicKey,
    });

    return deviceID;
  } catch (error) {
    console.error("Failed to compute device ID:", error);
    throw error;
  }
};
