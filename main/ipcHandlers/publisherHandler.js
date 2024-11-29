const { ipcMain } = require("electron");
const path = require("path");
const ProtoBufHandler = require("../protoBufHandler");
const logger = require("../../Logger");

function sanitizeArgs(args) {
  const sanitizedArgs = { ...args };

  if (sanitizedArgs.password) sanitizedArgs.password = "***REDACTED***";
  if (sanitizedArgs.long_lived_token)
    sanitizedArgs.long_lived_token = "***REDACTED***";

  return sanitizedArgs;
}

function setupPublisherHandlers() {
  const protoHandler = new ProtoBufHandler(
    path.resolve(__dirname, "../../protos/v1/publisher.proto"),
    {
      serviceName: "Publisher",
      servicePackage: "publisher.v1",
    }
  );

  const publisherUrl =
    process.env.PUBLISHER_URL ||
    "publisher.smswithoutborders.com:443";
  protoHandler.connectToServer(publisherUrl, true);

  const entityMethods = protoHandler.getMethods();
  Object.keys(entityMethods).forEach((methodName) => {
    ipcMain.handle(`${methodName}`, async (event, args) => {
      try {
        const sanitizedArgs = sanitizeArgs(args);
        logger.info(`Connected to Publisher server at: ${publisherUrl}`);
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

module.exports = { setupPublisherHandlers };
