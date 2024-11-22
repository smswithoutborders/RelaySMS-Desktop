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

    console.log(commandArgs.join(" "));
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
    const deviceIDBuffer = Buffer.from(deviceID, "utf-8");

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

module.exports = {
  decryptLongLivedToken,
  generateKeyPair,
  encryptPayload,
  deriveSecretKey,
  createTransmissionPayload,
  clearRatchetState,
};
