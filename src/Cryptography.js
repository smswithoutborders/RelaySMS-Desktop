import base64 from 'base64-js';
import { createDecipheriv } from 'crypto-browserify';

export default function decryptLongLivedToken(lltCipherText, serverDeviceId, clientDeviceId) {
  // Convert keys from base64 strings to buffers
  const serverDeviceIdBuffer = base64.toByteArray(serverDeviceId);
  const clientDeviceIdBuffer = base64.toByteArray(clientDeviceId);

  // Create the decryption key by concatenating clientDeviceId and serverDeviceId
  const decryptionKey = Buffer.concat([clientDeviceIdBuffer, serverDeviceIdBuffer]);

  // Decode and decrypt the token
  const cipherTextBuffer = base64.toByteArray(lltCipherText);
  const iv = cipherTextBuffer.slice(0, 16); // Extract IV from cipher text
  const encryptedData = cipherTextBuffer.slice(16); // Extract encrypted data

  const decipher = createDecipheriv('aes-256-cbc', decryptionKey, iv);
  let decrypted = decipher.update(encryptedData, 'binary', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
