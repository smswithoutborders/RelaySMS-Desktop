// preload.js

const { contextBridge } = require("electron");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

// Load the protobuf file
const PROTO_PATH = "../vault.proto";

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const serviceProto =
  grpc.loadPackageDefinition(packageDefinition).yourServicePackageName;

// Create a gRPC client instance
const client = new serviceProto.YourServiceName(
  "staging.smswithoutborders.com:9050",
  grpc.credentials.createInsecure()
);

contextBridge.exposeInMainWorld("grpcClient", {
  yourServiceMethod: (request, callback) => {
    client.yourServiceMethod(request, callback);
  },
});
