const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

class ProtoBufHandler {
  constructor(protoPath, serviceConfig) {
    this.protoPath = protoPath;
    this.serviceConfig = serviceConfig;
    this.services = {};
    this.loadProto();
  }

  loadProto() {
    const packageDefinition = protoLoader.loadSync(this.protoPath, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const proto = grpc.loadPackageDefinition(packageDefinition);
    const servicePackage = this.getNestedPackage(
      proto,
      this.serviceConfig.servicePackage
    );
    this.service = servicePackage[this.serviceConfig.serviceName];
    if (!this.service) {
      throw new Error(
        `Service ${this.serviceConfig.serviceName} not found in ${this.serviceConfig.servicePackage}`
      );
    }
  }

  connectToServer(serverAddress, useSecure = false) {
    let credentials;
    
    if (useSecure) {
      credentials = grpc.credentials.createSsl();
    } else {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Insecure gRPC connections are not allowed in production');
      }
      credentials = grpc.credentials.createInsecure();
    }

    this.client = new this.service(serverAddress, credentials);

    Object.keys(this.service.service).forEach((methodName) => {
      this.services[methodName] = async (request) => {
        return new Promise((resolve, reject) => {
          this.client[methodName](request, (err, response) => {
            if (err) reject(err);
            else resolve(response);
          });
        });
      };
    });
  }

  getNestedPackage(proto, packagePath) {
    return packagePath.split(".").reduce((acc, key) => acc[key], proto);
  }

  getMethods() {
    return this.services;
  }
}

module.exports = ProtoBufHandler;
