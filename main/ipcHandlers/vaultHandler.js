const { ipcMain } = require("electron");
const path = require("path");
const ProtoBufHandler = require("../protoBufHandler");
const logger = require("../../Logger");

function sanitizeArgs(args) {
  const sanitizedArgs = { ...args };

  if (sanitizedArgs.password) sanitizedArgs.password = "***REDACTED***";
  if (sanitizedArgs.current_password)
    sanitizedArgs.current_password = "***REDACTED***";
  if (sanitizedArgs.new_password) sanitizedArgs.new_password = "***REDACTED***";
  if (sanitizedArgs.long_lived_token)
    sanitizedArgs.long_lived_token = "***REDACTED***";

  return sanitizedArgs;
}

function setupVaultHandlers() {
  const protoHandler = new ProtoBufHandler(
    path.resolve(__dirname, "../../protos/v1/vault.proto"),
    {
      serviceName: "Entity",
      servicePackage: "vault.v1",
    }
  );

  const vaultUrl =
    process.env.VAULT_URL || "vault.smswithoutborders.com:443";
  protoHandler.connectToServer(vaultUrl, true);

  const entityMethods = protoHandler.getMethods();
  Object.keys(entityMethods).forEach((methodName) => {
    ipcMain.handle(`${methodName}`, async (event, args) => {
      try {
        const sanitizedArgs = sanitizeArgs(args);
        logger.info(`Connected to Vault server at: ${vaultUrl}`);
        logger.info(`Invoking gRPC method: ${methodName}`, { sanitizedArgs });
        const response = await entityMethods[methodName](args);
        return response;
      } catch (error) {
        const sanitizedArgs = sanitizeArgs(args);
        logger.error(`Error in gRPC method '${methodName}'`, {
          sanitizedArgs,
          error: error.message,
        });
        throw error;
      }
    });
  });
}

module.exports = { setupVaultHandlers };
