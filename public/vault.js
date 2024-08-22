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

const target = "vault.beta.smswithoutborders.com:443";
const credentials = grpc.credentials.createFromSecureContext();
const client = new vault_proto.Entity(target, credentials);

function createEntity(
  {
    phone_number,
    password,
    country_code,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response,
  },
  callback
) {
  client.CreateEntity(
    {
      phone_number,
      password,
      country_code,
      client_device_id_pub_key,
      client_publish_pub_key,
      ownership_proof_response,
    },
    callback
  );
}

function authenticateEntity(
  {
    phone_number,
    password,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response,
  },
  callback
) {
  client.AuthenticateEntity(
    {
      phone_number,
      password,
      client_device_id_pub_key,
      client_publish_pub_key,
      ownership_proof_response,
    },
    callback
  );
}

function listEntityStoredTokens({ long_lived_token }, callback) {
  client.ListEntityStoredTokens({ long_lived_token }, callback);
}

function deleteEntity({long_lived_token}, callback) {
  client.DeleteEntity({ long_lived_token }, callback);
}

function resetPassword(
  {
    phone_number,
    new_password,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response,
  },
  callback
) {
  client.ResetPassword(
    {
      phone_number,
      new_password,
      client_device_id_pub_key,
      client_publish_pub_key,
      ownership_proof_response,
    },
    callback
  );
}

function updateEntityPassword(
  {
    current_password,
    long_lived_token,
    new_password,  
  },
  callback
) {
  client.UpdateEntityPassword(
    {
      current_password,
      long_lived_token,
      new_password,
    },
    callback
  );
}

module.exports = {
  createEntity,
  authenticateEntity,
  listEntityStoredTokens,
  deleteEntity,
  resetPassword,
  updateEntityPassword
};
