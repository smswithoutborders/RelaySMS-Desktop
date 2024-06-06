const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const packageDefinition = protoLoader.loadSync("example.proto", {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const exampleProto = grpc.loadPackageDefinition(packageDefinition).example;

function sayHello(call, callback) {
  callback(null, { message: "Hello " + call.request.name });
}

function main() {
  const server = new grpc.Server();
  server.addService(exampleProto.Greeter.service, { sayHello: sayHello });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("Server running at http://0.0.0.0:50051");
    }
  );
}

main();
