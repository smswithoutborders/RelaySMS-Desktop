const { contextBridge } = require("electron");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("service.proto", {});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

const client = new exampleProto.ExampleService(
  "localhost:50051",
  grpc.credentials.createInsecure()
);

contextBridge.exposeInMainWorld("api", {
  getExampleData: (requestId) => {
    return new Promise((resolve, reject) => {
      client.getExampleData({ requestId }, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  },
});
