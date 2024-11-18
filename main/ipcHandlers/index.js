const { setupVaultHandlers } = require("./vaultHandler");
const { setupDBHandlers } = require("./dbHandler");

function registerIpcHandlers() {
  setupVaultHandlers();
  setupDBHandlers();
}

module.exports = { registerIpcHandlers };
