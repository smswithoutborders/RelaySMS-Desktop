const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "vault.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const vault_proto = grpc.loadPackageDefinition(packageDefinition).vault.v1;

const target = "staging.smswithoutborders.com:9050";
const credentials = grpc.credentials.createFromSecureContext();
const client = new vault_proto.Entity(target, credentials);

function createEntity({
  phone_number,
  password,
  country_code,
  client_device_id_pub_key,
  client_publish_pub_key,
  ownership_proof_response,
}, callback) {
  client.CreateEntity({
    phone_number,
    password,
    country_code,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response,
  }, callback);
}

function authenticateEntity({
  phone_number,
  password,
  client_device_id_pub_key,
  client_publish_pub_key,
  ownership_proof_response,
}, callback) {
  client.AuthenticateEntity({
    phone_number,
    password,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response,
  }, callback);
}

function listEntityStoredTokens(long_lived_token, callback) {
  client.ListEntityStoredTokens({ long_lived_token }, callback);
}

module.exports = {
  createEntity,
  authenticateEntity,
  listEntityStoredTokens,
};
