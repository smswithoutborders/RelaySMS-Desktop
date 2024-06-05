const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("service.proto", {});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

function getExampleData(call, callback) {
  callback(null, { responseMessage: `Hello, ${call.request.requestId}` });
}

function main() {
  const server = new grpc.Server();
  server.addService(exampleProto.ExampleService.service, {
    getExampleData: getExampleData,
  });
  server.bindAsync(
    "127.0.0.1:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Server running at http://127.0.0.1:50051");
    }
  );
}

main();
