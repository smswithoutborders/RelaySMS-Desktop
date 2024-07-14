const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const PROTO_PATH = path.join(__dirname, "publisher.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const publisher_proto = grpc.loadPackageDefinition(packageDefinition).publisher.v1;

const target = "staging.smswithoutborders.com:9060"; 
const credentials = grpc.credentials.createFromSecureContext(); 
const client = new publisher_proto.Publisher(target, credentials); 

function getOAuth2AuthorizationUrl({
  platform,
  state,
  code_verifier,
  autogenerate_code_verifier,
}, callback) {
  client.GetOAuth2AuthorizationUrl({
    platform,
    state,
    code_verifier,
    autogenerate_code_verifier,
  }, callback);
}

function exchangeOAuth2CodeAndStore({
  long_lived_token,
  platform,
  authorization_code,
  code_verifier,
}, callback) {
  client.exchangeOAuth2CodeAndStore({
    long_lived_token,
    platform,
    authorization_code,
    code_verifier,
  }, callback);
}

module.exports = {
  getOAuth2AuthorizationUrl,
  exchangeOAuth2CodeAndStore
};
