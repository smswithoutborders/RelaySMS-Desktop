import { EntityClient } from "./proto/vault_grpc_web_pb";
import {
  CreateEntityRequest,
  AuthenticateEntityRequest,
  CompleteAuthenticationRequest,
} from "./proto/vault_pb";

const client = new EntityClient(
  "https://staging.smswithoutborders.com:9050",
  null,
  null
);

function createEntity(phoneNumber, callback) {
  const request = new CreateEntityRequest();
  request.setPhoneNumber(phoneNumber);

  client.createEntity(request, {}, (err, response) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, response);
    }
  });
}

function authenticateEntity(phoneNumber, password, callback) {
  const request = new AuthenticateEntityRequest();
  request.setPhoneNumber(phoneNumber);
  request.setPassword(password);

  client.authenticateEntity(request, {}, (err, response) => {
    callback(err, response);
  });
}

function completeAuthentication(completeRequest, callback) {
  const request = new CompleteAuthenticationRequest();
  request.setPhoneNumber(completeRequest.phoneNumber);
  request.setOwnershipProofResponse(completeRequest.ownershipProofResponse);
  request.setClientPublishPubKey(completeRequest.clientPublishPubKey);
  request.setClientDeviceIdPubKey(completeRequest.clientDeviceIdPubKey);

  client.completeAuthentication(request, {}, (err, response) => {
    callback(err, response);
  });
}

function completeEntity(completeRequest, callback) {
  const request = new AuthenticateEntityRequest();
  request.setPhoneNumber(completeRequest.phoneNumber);
  request.setCountryCode(completeRequest.countryCode);
  request.setPassword(completeRequest.password);
  request.setOwnershipProofResponse(completeRequest.ownershipProofResponse);
  request.setClientPublishPubKey(completeRequest.clientPublishPubKey);
  request.setClientDeviceIdPubKey(completeRequest.clientDeviceIdPubKey);

  client.authenticateEntity(request, {}, (err, response) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, response);
    }
  });
}

export {
  createEntity,
  completeEntity,
  authenticateEntity,
  completeAuthentication,
};
