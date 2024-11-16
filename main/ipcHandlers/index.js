const { setupVaultHandlers } = require("./vaultHandler");

function registerIpcHandlers() {
  setupVaultHandlers();
}

module.exports = { registerIpcHandlers };
