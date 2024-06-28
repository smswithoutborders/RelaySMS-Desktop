const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const storage = require("electron-json-storage");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");

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
      client_publish_pub_key,
      client_device_id_pub_key,
      ownership_proof_response,
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

function authenticateEntity(
  {
    phone_number,
    password,
    client_publish_pub_key,
    client_device_id_pub_key,
    ownership_proof_response,
  },
  callback
) {
  client.AuthenticateEntity(
    {
      phone_number,
      password,
      client_publish_pub_key,
      client_device_id_pub_key,
      ownership_proof_response,
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

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
    icon: path.join(__dirname, "icon.png"),
  });

  const appURL = app.isPackaged
    ? url.format({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file:",
        slashes: true,
      })
    : "http://localhost:3000";
  mainWindow.loadURL(appURL);

  if (!app.isPackaged) {
    mainWindow.webContents.openDevTools();
  }
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request) => {
      const url = request.url.substr(8);
      ({ path: path.normalize(`${__dirname}/${url}`) });
    },
    (error) => {
      if (error) console.error("Failed to register protocol");
    }
  );
}

app.whenReady().then(() => {
  const dataPath = app.getPath("userData");
  console.log(`Setting storage data path: ${dataPath}`);
  storage.setDataPath(dataPath);

  createWindow();
  setupLocalFilesNormalizerProxy();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

const allowedNavigationDestinations = "https://my-electron-app.com";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

ipcMain.handle(
  "create-entity",
  async (
    event,
    {
      phoneNumber,
      password,
      country_code,
      client_device_id_pub_key,
      client_publish_pub_key,
      ownership_proof_response,
    }
  ) => {
    return new Promise((resolve, reject) => {
      createEntity(
        {
          phone_number: phoneNumber,
          password: password,
          country_code: country_code,
          client_device_id_pub_key: client_device_id_pub_key,
          client_publish_pub_key: client_publish_pub_key,
          ownership_proof_response: ownership_proof_response,
        },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
);

ipcMain.handle(
  "authenticate-entity",
  async (
    event,
    {
      phoneNumber,
      password,
      client_publish_pub_key,
      client_device_id_pub_key,
      ownership_proof_response,
    }
  ) => {
    return new Promise((resolve, reject) => {
      authenticateEntity(
        {
          phone_number: phoneNumber,
          password: password,
          client_publish_pub_key,
          client_device_id_pub_key,
          ownership_proof_response: ownership_proof_response,
        },
        (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response);
          }
        }
      );
    });
  }
);

ipcMain.handle("store-params", async (event, { key, params }) => {
  return new Promise((resolve, reject) => {
    const encryptedParams = safestorage.encryptString(JSON.stringify(params));
    storage.set(key, { data: encryptedParams }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("retrieve-params", async (event, { key }) => {
  return new Promise((resolve, reject) => {
    storage.get(key, (error, data) => {
      if (error) {
        reject(error);
      } else {
        if (data && data.data) {
          try {
            const decryptedParams = safestorage.decryptString(data.data);
            resolve(JSON.parse(decryptedParams));
          } catch (decryptionError) {
            reject(decryptionError);
          }
        } else {
          resolve(null);
        }
      }
    });
  });
});

ipcMain.handle("store-onboarding-step", async (event, step) => {
  return new Promise((resolve, reject) => {
    storage.set("onboardingStep", { step }, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("retrieve-onboarding-step", async () => {
  return new Promise((resolve, reject) => {
    storage.get("onboardingStep", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data && data.step !== undefined ? data.step : 0);
      }
    });
  });
});
