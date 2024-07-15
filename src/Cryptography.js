// decryption.js

import { createHash, createDecipheriv } from "crypto-browserify";

// Function to derive the key
export function deriveKey(sharedSecret) {
  const hash = createHash("sha256");
  hash.update(sharedSecret);
  return hash.digest().slice(0, 32); // Fernet uses 256-bit keys
}

// Function to decrypt the token
export function decryptFernet(key, token) {
  const keyBuffer = Buffer.from(key, "base64");
  const tokenBuffer = Buffer.from(token, "base64");

  const iv = tokenBuffer.slice(1, 17); // Initialization vector
  const ciphertext = tokenBuffer.slice(17, -32); // Ciphertext
  const hmac = tokenBuffer.slice(-32); // HMAC

  const decipher = createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(ciphertext, "binary", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}

// Function to get the decrypted LLT
export async function getDecryptedLLT() {
  const lltCiphertext = await window.api.retrieveParams("encrypted_llt");
  const sharedSecretKey = await window.api.retrieveParams("shared_secret_key");
  const derivedKey = deriveKey(sharedSecretKey);
  return decryptFernet(derivedKey, lltCiphertext);
}
