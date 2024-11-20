const { setupVaultHandlers } = require("./vaultHandler");
const { setupDBHandlers } = require("./dbHandler");
const { setupPublisherHandlers } = require("./publisherHandler");
const { setupCryptoHandlers } = require("./cryptoHandler");

function registerIpcHandlers() {
  setupVaultHandlers();
  setupDBHandlers();
  setupPublisherHandlers();
  setupCryptoHandlers();
}

module.exports = { registerIpcHandlers };
