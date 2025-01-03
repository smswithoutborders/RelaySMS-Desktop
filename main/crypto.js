const fs = require("fs");
const path = require("path");
const { execFile } = require("child_process");
const util = require("util");
const crypto = require("crypto");
const nacl = require("tweetnacl");
nacl.util = require("tweetnacl-util");
const fernet = require("fernet");

const generateKeyPair = () => {
  try {
    const keyPair = nacl.box.keyPair();
    const publicKey = nacl.util.encodeBase64(keyPair.publicKey);
    const privateKey = nacl.util.encodeBase64(keyPair.secretKey);
    return {
      publicKey,
      privateKey,
    };
  } catch (err) {
    throw err;
  }
};

const computeDeviceID = async ({
  phoneNumber,
  clientDeviceIDPublicKey,
  clientDeviceIdPrivateKey,
  serverDeviceIdPublicKey,
}) => {
  try {
    const clientDeviceIDPublicKeyBuffer = nacl.util.decodeBase64(
      clientDeviceIDPublicKey
    );
    const clientPrivateKeyBuffer = nacl.util.decodeBase64(
      clientDeviceIdPrivateKey
    );
    const serverPublicKeyBuffer = nacl.util.decodeBase64(
      serverDeviceIdPublicKey
    );

    const deviceIDSecretKeyBuffer = nacl.scalarMult(
      clientPrivateKeyBuffer,
      serverPublicKeyBuffer
    );

    const derivedKey = await __getDerivedKey(deviceIDSecretKeyBuffer);

    const combinedBuffer = Buffer.concat([
      Buffer.from(phoneNumber, "utf-8"),
      clientDeviceIDPublicKeyBuffer,
    ]);

    return crypto
      .createHmac("sha256", derivedKey)
      .update(combinedBuffer)
      .digest("base64");
  } catch (err) {
    throw err;
  }
};

const __getDerivedKey = async (secretKey) => {
  const hkdfAsync = util.promisify(crypto.hkdf);
  const info = Buffer.from("x25591_key_exchange");
  const salt = Buffer.alloc(32, 0);

  try {
    const derivedKey = await hkdfAsync("sha256", secretKey, salt, info, 32);
    return derivedKey;
  } catch (err) {
    throw err;
  }
};

const _deriveFernetKey = (secretKey) => {
  try {
    const encodedKey = Buffer.from(secretKey).toString("base64url");
    const fernetKey = new fernet.Secret(encodedKey);

    return fernetKey;
  } catch (err) {
    throw err;
  }
};

const decryptLongLivedToken = async ({
  client_device_id_private_key,
  server_device_id_public_key,
  long_lived_token_cipher,
}) => {
  try {
    const client_secret_key = nacl.scalarMult(
      nacl.util.decodeBase64(client_device_id_private_key),
      nacl.util.decodeBase64(server_device_id_public_key)
    );

    const derivedKey = await __getDerivedKey(client_secret_key);
    const fernetKey = _deriveFernetKey(Buffer.from(derivedKey));

    const fernetObj = new fernet.Token({
      secret: fernetKey,
      ttl: 0,
      token: Buffer.from(long_lived_token_cipher, "base64").toString("utf-8"),
    });

    const decodedToken = fernetObj.decode();

    return decodedToken;
  } catch (err) {
    throw err;
  }
};

const encryptPayload = ({
  userDataDir,
  content,
  identifier,
  publishSecretKey,
  serverPublishPublicKey,
}) => {
  return new Promise((resolve, reject) => {
    const cliPath = path.join(userDataDir, "py_double_ratchet_cli");
    const pythonPath = path.join(cliPath, "venv", "bin", "python3");
    const cliScript = path.join(cliPath, "cli.py");

    const commandArgs = [
      pythonPath,
      cliScript,
      "-c",
      `"${content}"`,
      "-p",
      identifier,
      "-s",
      publishSecretKey,
      "-k",
      serverPublishPublicKey,
      "-b",
      cliPath,
    ];

    execFile("bash", ["-c", commandArgs.join(" ")], (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Encryption failed: ${stderr || error.message}`));
      } else {
        resolve(stdout.trim());
      }
    });
  });
};

const clearRatchetState = (userDataDir) => {
  try {
    const cliPath = path.join(userDataDir, "py_double_ratchet_cli");
    const files = fs.readdirSync(cliPath);

    files.forEach((file) => {
      if (file.endsWith(".db")) {
        fs.unlinkSync(path.join(cliPath, file));
      }
    });
  } catch (err) {
    throw err;
  }
};

async function deriveSecretKey(
  clientPublishPrivateKey,
  serverPublishPublicKey
) {
  try {
    const clientPrivateKeyDecoded = nacl.util.decodeBase64(
      clientPublishPrivateKey
    );
    const serverPubKeyDecoded = nacl.util.decodeBase64(serverPublishPublicKey);

    const publishSharedSecret = nacl.scalarMult(
      clientPrivateKeyDecoded,
      serverPubKeyDecoded
    );

    const derivedKey = await __getDerivedKey(publishSharedSecret);
    return Buffer.from(derivedKey).toString("base64");
  } catch (err) {
    throw err;
  }
}

const createTransmissionPayload = ({
  contentCiphertext,
  platformShortCode,
  deviceID,
}) => {
  try {
    const platformShortCodeBuffer = Buffer.from(platformShortCode, "utf-8");
    const contentCiphertextBuffer = Buffer.from(contentCiphertext, "base64");
    const deviceIDBuffer = Buffer.from(deviceID, "base64");

    const lengthBuffer = Buffer.alloc(4);
    lengthBuffer.writeInt32LE(contentCiphertextBuffer.length);

    const payload = Buffer.concat([
      lengthBuffer,
      platformShortCodeBuffer,
      contentCiphertextBuffer,
      deviceIDBuffer,
    ]);

    return payload.toString("base64");
  } catch (error) {
    throw error;
  }
};

const createBridgeTransmissionPayload = ({
  contentSwitch,
  authorizationCode,
  contentCiphertext,
  bridgeShortCode,
  clientPublishPublicKey,
  deviceID,
}) => {
  try {
    let payload;

    const bridgeIndicator = Buffer.from([0]);
    const contentSwitchBuffer = Buffer.from([contentSwitch]);

    switch (contentSwitch) {
      case 0: {
        const clientPublishPublicKeyBuffer = nacl.util.decodeBase64(
          clientPublishPublicKey
        );
        const lenClientPublishPublicKeyBuffer = Buffer.alloc(4);
        lenClientPublishPublicKeyBuffer.writeInt32LE(
          clientPublishPublicKeyBuffer.length
        );

        payload = Buffer.concat([
          bridgeIndicator,
          contentSwitchBuffer,
          lenClientPublishPublicKeyBuffer,
          clientPublishPublicKeyBuffer,
        ]);
        break;
      }
      case 2: {
        const authCodeBuffer = Buffer.from(authorizationCode, "utf-8");
        const contentCiphertextBuffer = Buffer.from(
          contentCiphertext,
          "base64"
        );
        const bridgeShortCodeBuffer = Buffer.from(bridgeShortCode, "utf-8");

        const authCodeLengthBuffer = Buffer.from([authCodeBuffer.length]);
        const ciphertextLengthBuffer = Buffer.alloc(4);
        ciphertextLengthBuffer.writeInt32LE(contentCiphertextBuffer.length);

        payload = Buffer.concat([
          bridgeIndicator,
          contentSwitchBuffer,
          authCodeLengthBuffer,
          ciphertextLengthBuffer,
          bridgeShortCodeBuffer,
          authCodeBuffer,
          contentCiphertextBuffer,
        ]);
        break;
      }
      case 3: {
        const contentCiphertextBuffer = Buffer.from(
          contentCiphertext,
          "base64"
        );
        const bridgeShortCodeBuffer = Buffer.from(bridgeShortCode, "utf-8");

        const ciphertextLengthBuffer = Buffer.alloc(4);
        ciphertextLengthBuffer.writeInt32LE(contentCiphertextBuffer.length);

        payload = Buffer.concat([
          bridgeIndicator,
          contentSwitchBuffer,
          ciphertextLengthBuffer,
          bridgeShortCodeBuffer,
          contentCiphertextBuffer,
        ]);
        break;
      }
      default:
        throw new Error(`Invalid content switch: ${contentSwitch}`);
    }

    return payload.toString("base64");
  } catch (error) {
    throw error;
  }
};

const extractBridgePayload = ({ content }) => {
  try {
    const contentBuffer = nacl.util.decodeBase64(content);
    const serverPublishPublicKeyLength = contentBuffer[0];
    const serverPublishPublicKeyBuffer = contentBuffer.slice(
      1,
      1 + serverPublishPublicKeyLength
    );

    if (serverPublishPublicKeyLength !== 32) {
      throw new Error("Invalid public key length. Expected 32 bytes.");
    }

    return {
      serverPublishPublicKey: nacl.util.encodeBase64(
        serverPublishPublicKeyBuffer
      ),
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  decryptLongLivedToken,
  generateKeyPair,
  encryptPayload,
  deriveSecretKey,
  createTransmissionPayload,
  clearRatchetState,
  createBridgeTransmissionPayload,
  extractBridgePayload,
  computeDeviceID,
};
