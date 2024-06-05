// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var service_pb = require('./service_pb.js');

function serialize_example_ExampleRequest(arg) {
  if (!(arg instanceof service_pb.ExampleRequest)) {
    throw new Error('Expected argument of type example.ExampleRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_example_ExampleRequest(buffer_arg) {
  return service_pb.ExampleRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_example_ExampleResponse(arg) {
  if (!(arg instanceof service_pb.ExampleResponse)) {
    throw new Error('Expected argument of type example.ExampleResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_example_ExampleResponse(buffer_arg) {
  return service_pb.ExampleResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var ExampleServiceService = exports.ExampleServiceService = {
  getExampleData: {
    path: '/example.ExampleService/GetExampleData',
    requestStream: false,
    responseStream: false,
    requestType: service_pb.ExampleRequest,
    responseType: service_pb.ExampleResponse,
    requestSerialize: serialize_example_ExampleRequest,
    requestDeserialize: deserialize_example_ExampleRequest,
    responseSerialize: serialize_example_ExampleResponse,
    responseDeserialize: deserialize_example_ExampleResponse,
  },
};

exports.ExampleServiceClient = grpc.makeGenericClientConstructor(ExampleServiceService);
