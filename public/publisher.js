const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");

const publisherURL = process.env.SMSWITHOUTBORDERS_PUBLISHER_URL || 'publisher.staging.smswithoutborders.com:443';

const PROTO_PATH = path.join(__dirname, "publisher.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const publisher_proto =
  grpc.loadPackageDefinition(packageDefinition).publisher.v1;

const target = publisherURL;
const credentials = grpc.credentials.createFromSecureContext();
const client = new publisher_proto.Publisher(target, credentials);

function getOAuth2AuthorizationUrl(
  { platform, state, code_verifier, autogenerate_code_verifier, redirect_url },
  callback
) {
  client.GetOAuth2AuthorizationUrl(
    {
      platform,
      state,
      code_verifier,
      autogenerate_code_verifier,
      redirect_url,
    },
    callback
  );
}

function exchangeOAuth2CodeAndStore(
  {
    long_lived_token,
    platform,
    authorization_code,
    code_verifier,
    redirect_url,
  },
  callback
) {
  client.ExchangeOAuth2CodeAndStore(
    {
      long_lived_token,
      platform,
      authorization_code,
      code_verifier,
      redirect_url,
    },
    callback
  );
}

function revokeAndDeleteOAuth2Token(
  { long_lived_token, platform, account_identifier },
  callback
) {
  client.RevokeAndDeleteOAuth2Token(
    {
      long_lived_token,
      platform,
      account_identifier,
    },
    callback
  );
}

function getPNBACode({ phone_number, platform }, callback) {
  client.GetPNBACode(
    {
      phone_number,
      platform,
    },
    callback
  );
}

function exchangePNBACodeAndStore(
  { authorization_code, long_lived_token, password, phone_number, platform },
  callback
) {
  client.ExchangePNBACodeAndStore(
    {
      authorization_code,
      long_lived_token,
      password,
      phone_number,
      platform,
    },
    callback
  );
}

module.exports = {
  getOAuth2AuthorizationUrl,
  exchangeOAuth2CodeAndStore,
  revokeAndDeleteOAuth2Token,
  getPNBACode,
  exchangePNBACodeAndStore,
};
