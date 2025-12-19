const { setupVaultHandlers } = require("./vaultHandler");
const { setupDBHandlers } = require("./dbHandler");
const { setupCryptoHandlers } = require("./cryptoHandler");
const { setupPublisherHandlers } = require("./publisherHandler");

function registerIpcHandlers() {
  setupVaultHandlers();
  setupDBHandlers();
  setupCryptoHandlers();
  setupPublisherHandlers();
}

module.exports = { registerIpcHandlers };
