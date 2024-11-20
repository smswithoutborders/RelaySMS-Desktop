const { ipcMain } = require("electron");
const logger = require("../../Logger");
const { generateKeyPair, decryptLongLivedToken } = require("../crypto");

function setupCryptoHandlers() {
  ipcMain.handle("generate-keypair", async (event) => {
    try {
      const keyPair = generateKeyPair();

      logger.info("Generated key pair successfully", {
        publicKey: keyPair.publicKey,
      });

      return keyPair;
    } catch (err) {
      logger.error("Error in generating key pair", { error: err.message });
      throw new Error(`Failed to generate key pair: ${err.message}`);
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
        throw new Error(`Failed to decrypt long-lived token: ${err.message}`);
      }
    }
  );
}

module.exports = {
  setupCryptoHandlers,
};
