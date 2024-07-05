const keytar = require('keytar');

const SERVICE_NAME = 'RelaySMS';

async function saveKey(keyName, keyValue) {
  await keytar.setPassword(SERVICE_NAME, keyName, keyValue);
}

async function getKey(keyName) {
  const keyValue = await keytar.getPassword(SERVICE_NAME, keyName);
  return keyValue;
}

async function deleteKey(keyName) {
  await keytar.deletePassword(SERVICE_NAME, keyName);
}

module.exports = {
  saveKey,
  getKey,
  deleteKey,
};
