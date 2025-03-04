const { setupVaultHandlers } = require("./vaultHandler");
const { setupDBHandlers } = require("./dbHandler");
const { setupCryptoHandlers } = require("./cryptoHandler");

function registerIpcHandlers() {
  setupVaultHandlers();
  setupDBHandlers();
  setupCryptoHandlers();
}

module.exports = { registerIpcHandlers };
