const { ipcMain } = require("electron");
const nacl = require("tweetnacl");
const fernet = require("fernet");
const util = require("util");
const crypto = require("crypto");
nacl.util = require("tweetnacl-util");
const logger = require("../../Logger");

function deriveFernetKey(sharedSecret) {
  const encodedKey = Buffer.from(sharedSecret).toString("base64url");
  return new fernet.Secret(encodedKey);
}

async function deriveSharedSecretKey(sharedSecret) {
  const hkdfAsync = util.promisify(crypto.hkdf);
  const info = Buffer.from("x25591_key_exchange");
  const salt = Buffer.alloc(32, 0);

  try {
    const derivedKey = await hkdfAsync("sha256", sharedSecret, salt, info, 32);
    return derivedKey;
  } catch (err) {
    throw err;
  }
}

async function decryptLongLivedToken(
  client_device_id_secret_key,
  server_device_id_pub_key,
  long_lived_token_cipher
) {
  const client_secret_key = nacl.scalarMult(
    nacl.util.decodeBase64(client_device_id_secret_key),
    nacl.util.decodeBase64(server_device_id_pub_key)
  );

  try {
    const derivedKey = await deriveSharedSecretKey(client_secret_key);
    const client_d_key = deriveFernetKey(Buffer.from(derivedKey));
    const fernet_obj = new fernet.Token({
      secret: client_d_key,
      ttl: 0,
      token: Buffer.from(long_lived_token_cipher, "base64").toString("utf-8"),
    });

    const decryptedMessage = fernet_obj.decode();
    return decryptedMessage;
  } catch (err) {
    throw new Error(`Error decrypting long-lived token: ${err.message}`);
  }
}

async function publishSharedSecret(
  client_publish_secret_key,
  server_publish_pub_key
) {
  const clientSecretKeyDecoded = nacl.util.decodeBase64(
    client_publish_secret_key
  );

  const serverPubKeyDecoded = nacl.util.decodeBase64(server_publish_pub_key);

  const publish_shared_secret = nacl.scalarMult(
    clientSecretKeyDecoded,
    serverPubKeyDecoded
  );

  try {
    const derivedKey = await deriveSharedSecretKey(publish_shared_secret);

    const shared_secret_buffer = Buffer.from(derivedKey);
    const shared_secret = shared_secret_buffer.toString("base64");

    return shared_secret;
  } catch (err) {
    throw new Error(`Error generating shared secret: ${err.message}`);
  }
}

function createPayload(encryptedContent, pl, deviceID = "") {
  const platformLetter = Buffer.from(pl, "utf-8");

  const contentCiphertext = Buffer.from(encryptedContent, "base64");

  const lengthBuffer = Buffer.alloc(4);
  lengthBuffer.writeInt32LE(contentCiphertext.length);

  const payload = Buffer.concat([
    lengthBuffer,
    platformLetter,
    contentCiphertext,
    Buffer.from(deviceID),
  ]);

  return payload.toString("base64");
}

function bridgePayload(contentSwitch, data, bridgeConst = 0) {
  const contentSwitchBuffer = Buffer.from([bridgeConst, contentSwitch]);
  let payload;

  switch (contentSwitch) {
    case 0:
      const publicKeyBuffer = nacl.util.decodeBase64(data);
      const lenPublicKeyBuffer = Buffer.alloc(4);
      lenPublicKeyBuffer.writeInt32LE(publicKeyBuffer.length);

      payload = Buffer.concat([
        contentSwitchBuffer,
        lenPublicKeyBuffer,
        publicKeyBuffer,
      ]);
      break;
    case 1:
      const authCodeBuffer = Buffer.from(data);
      const lenAuthCodeBuffer = Buffer.alloc(4);
      lenAuthCodeBuffer.writeInt32LE(authCodeBuffer.length);

      payload = Buffer.concat([
        contentSwitchBuffer,
        lenAuthCodeBuffer,
        authCodeBuffer,
      ]);
      break;
    default:
      throw new Error(`Invalid content switch: ${contentSwitch}`);
  }

  return payload.toString("base64");
}

function extractPublicKeyFromAuthPhrase(authPhrase) {
  const decodedPhrase = nacl.util.decodeBase64(authPhrase);
  const pubKeyLength = decodedPhrase[0];

  const publicKey = decodedPhrase.slice(2, 2 + pubKeyLength);
  return nacl.util.encodeBase64(publicKey);
}

function setupCryptoHandlers() {
  ipcMain.handle("decryptLongLivedToken", async (event, args) => {
    const {
      client_device_id_secret_key,
      server_device_id_pub_key,
      long_lived_token_cipher,
    } = args;
    try {
      const result = await decryptLongLivedToken(
        client_device_id_secret_key,
        server_device_id_pub_key,
        long_lived_token_cipher
      );
      return result;
    } catch (error) {
      logger.error("Error in decryptLongLivedToken", error);
      throw error;
    }
  });

  ipcMain.handle("publishSharedSecret", async (event, args) => {
    const { client_publish_secret_key, server_publish_pub_key } = args;
    try {
      const result = await publishSharedSecret(
        client_publish_secret_key,
        server_publish_pub_key
      );
      return result;
    } catch (error) {
      logger.error("Error in publishSharedSecret", error);
      throw error;
    }
  });

  ipcMain.handle("createPayload", (event, args) => {
    const { encryptedContent, pl, deviceID } = args;
    try {
      const result = createPayload(encryptedContent, pl, deviceID);
      return result;
    } catch (error) {
      logger.error("Error in createPayload", error);
      throw error;
    }
  });

  ipcMain.handle("bridgePayload", (event, args) => {
    const { contentSwitch, data, bridgeConst } = args;
    try {
      const result = bridgePayload(contentSwitch, data, bridgeConst);
      return result;
    } catch (error) {
      logger.error("Error in bridgePayload", error);
      throw error;
    }
  });

  ipcMain.handle("extractPublicKeyFromAuthPhrase", (event, args) => {
    const { authPhrase } = args;
    try {
      const result = extractPublicKeyFromAuthPhrase(authPhrase);
      return result;
    } catch (error) {
      logger.error("Error in extractPublicKeyFromAuthPhrase", error);
      throw error;
    }
  });
}

module.exports = {
  setupCryptoHandlers,
};
