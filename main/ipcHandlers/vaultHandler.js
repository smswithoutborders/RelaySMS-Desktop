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

  const vaultUrl =
    process.env.SMSWITHOUTBORDERS_VAULT_URL ||
    "vault.staging.smswithoutborders.com:443";
  protoHandler.connectToServer(vaultUrl, true);

  const entityMethods = protoHandler.getMethods();
  Object.keys(entityMethods).forEach((methodName) => {
    ipcMain.handle(`${methodName}`, async (event, args) => {
      try {
        logger.info(`Connected to Vault server at: ${vaultUrl}`);
        logger.info(`Invoking gRPC method: ${methodName}`, { args });
        const response = await entityMethods[methodName](args);
        return response;
      } catch (error) {
        logger.error(`Error in gRPC method '${methodName}'`, {
          args,
          error: error.message,
          stack: error.stack,
        });
        throw error;
      }
    });
  });
}

module.exports = { setupVaultHandlers };
