const { ipcMain, app } = require("electron");
const logger = require("../../Logger");
const {
  generateKeyPair,
  decryptLongLivedToken,
  encryptPayload,
  deriveSecretKey,
  createTransmissionPayload,
  clearRatchetState,
} = require("../crypto");

function setupCryptoHandlers() {
  ipcMain.handle("generate-keypair", async (event) => {
    try {
      const keyPair = generateKeyPair();

      logger.info("Generated key pair successfully");

      return keyPair;
    } catch (err) {
      logger.error("Error in generating key pair", { error: err.message });
      throw err;
    }
  });

  ipcMain.handle(
    "decrypt-long-lived-token",
    async (
      event,
      {
        client_device_id_private_key,
        server_device_id_public_key,
        long_lived_token_cipher,
      }
    ) => {
      try {
        const decryptedToken = await decryptLongLivedToken({
          client_device_id_private_key,
          server_device_id_public_key,
          long_lived_token_cipher,
        });

        logger.info("Successfully decrypted long-lived token");

        return decryptedToken;
      } catch (err) {
        logger.error("Error in decrypting long-lived token", {
          error: err.message,
        });
        throw err;
      }
    }
  );

  ipcMain.handle(
    "encrypt-payload",
    async (
      event,
      { content, identifier, publishSecretKey, serverPublishPublicKey }
    ) => {
      try {
        const result = await encryptPayload({
          userDataDir: app.getPath("userData"),
          content,
          identifier,
          publishSecretKey,
          serverPublishPublicKey,
        });

        logger.info("Successfully encrypted payload");

        return result;
      } catch (error) {
        logger.error("Error in encrypt-payload handler:", error.message);
        throw error;
      }
    }
  );

  ipcMain.handle(
    "derive-secret-key",
    async (event, { clientPublishPrivateKey, serverPublishPublicKey }) => {
      try {
        const sharedSecret = await deriveSecretKey(
          clientPublishPrivateKey,
          serverPublishPublicKey
        );
        return sharedSecret;
      } catch (error) {
        logger.error("Error in derive-secret-key handler:", error.message);
        throw error;
      }
    }
  );

  ipcMain.handle(
    "create-transmission-payload",
    async (event, { contentCiphertext, platformShortCode, deviceID }) => {
      try {
        const payload = createTransmissionPayload({
          contentCiphertext,
          platformShortCode,
          deviceID,
        });
        return payload;
      } catch (error) {
        console.error(
          "Error in create-transmission-payload handler:",
          error.message
        );
        throw error;
      }
    }
  );

  ipcMain.handle("clear-ratchet-state", async () => {
    try {
      const userDataDir = app.getPath("userData");
      const deletedCount = clearRatchetState(userDataDir);

      logger.info(
        `Cleared ratchet state. Deleted ${deletedCount} database file(s).`
      );
    } catch (error) {
      logger.error("Error in clear-ratchet-state handler:", error.message);
      throw error;
    }
  });
}

module.exports = {
  setupCryptoHandlers,
};
