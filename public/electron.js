const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const url = require("url");
const storage = require("electron-json-storage");
const { createEntity, authenticateEntity } = require("../src/grpcNode");

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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
    (request, callback) => {
      const url = request.url.substr(8);
      callback({ path: path.normalize(`${__dirname}/${url}`) });
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

// IPC handler for gRPC call
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
  async (event, { phoneNumber, password }) => {
    return new Promise((resolve, reject) => {
      authenticateEntity(
        { phone_number: phoneNumber, password: password },
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
