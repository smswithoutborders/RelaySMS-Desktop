const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "proto/vault.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const vault_proto = grpc.loadPackageDefinition(packageDefinition).vault.v1;

const target = "staging.smswithoutborders.com:9050";
const credentials = grpc.credentials.createSsl();
const client = new vault_proto.Entity(target, credentials);

function createEntity({ phone_number, password }, callback) {
  client.CreateEntity(
    {
      phone_number,
      password,
      // country_code: "US",
      // client_publish_pub_key: "client_publish_pub_key_value",
      // client_device_id_pub_key: "client_device_id_pub_key_value",
      // ownership_proof_response: "ownership_proof_response_value",
    },
    function (err, response) {
      if (err) {
        console.error("gRPC error:", err);
        callback(err, null);
      } else {
        console.log("gRPC response:", response);
        callback(null, response);
      }
    }
  );
}

module.exports = {
  createEntity,
};
