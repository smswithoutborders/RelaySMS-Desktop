const { ipcMain } = require("electron");
const path = require("path");
const ProtoBufHandler = require("../protoBufHandler");
const logger = require("../../Logger");

function setupVaultHandlers() {
  const protoHandler = new ProtoBufHandler(
    path.resolve(__dirname, "../../protos/v1/vault.proto"),
    {
      serviceName: "Entity",
      servicePackage: "vault.v1",
    }
  );

  protoHandler.connectToServer(
    process.env.SMSWITHOUTBORDERS_VAULT_URL ||
      "vault.staging.smswithoutborders.com:443",
    true
  );

  const entityMethods = protoHandler.getMethods();
  Object.keys(entityMethods).forEach((methodName) => {
    ipcMain.handle(`${methodName}`, async (event, args) => {
      try {
        const response = await entityMethods[methodName](args);
        return response;
      } catch (error) {
        logger.error(`Error in method '${methodName}'`, error);
        throw error;
      }
    });
  });
}

module.exports = { setupVaultHandlers };
