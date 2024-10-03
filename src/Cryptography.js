const nacl = require("tweetnacl");
const fernet = require("fernet");
const util = require("util");
const crypto = require("crypto");
nacl.util = require("tweetnacl-util");

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
  console.log(">>>>", client_device_id_secret_key);
  console.log(">>>>", server_device_id_pub_key);
  console.log(">>>>", long_lived_token_cipher);

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
    console.log(">>>>", decryptedMessage);

    return decryptedMessage;
  } catch (err) {
    throw new Error(`Error decrypting long-lived token: ${err.message}`);
  }
}

async function publishSharedSecret(
  client_publish_secret_key,
  server_publish_pub_key
) {

  // Decode the keys from Base64
  const clientSecretKeyDecoded = nacl.util.decodeBase64(
    client_publish_secret_key
  );

  const serverPubKeyDecoded = nacl.util.decodeBase64(server_publish_pub_key);

  // Generate shared secret
  const publish_shared_secret = nacl.scalarMult(
    clientSecretKeyDecoded,
    serverPubKeyDecoded
  );

  try {
    const derivedKey = await deriveSharedSecretKey(publish_shared_secret);
        
    // Encode the derived key using Buffer
    const shared_secret_buffer = Buffer.from(derivedKey);

    // Convert to Base64 
    const shared_secret = shared_secret_buffer.toString("base64"); 

    console.log(">>Crypto shared secret:", shared_secret);

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

module.exports = {
  decryptLongLivedToken,
  publishSharedSecret,
  createPayload,
};
