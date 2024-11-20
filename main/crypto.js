const nacl = require("tweetnacl");
const fernet = require("fernet");
const util = require("util");
const crypto = require("crypto");
nacl.util = require("tweetnacl-util");

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

module.exports = { decryptLongLivedToken, generateKeyPair };
