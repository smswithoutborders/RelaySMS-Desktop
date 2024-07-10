/* eslint-disable no-unused-expressions */
const { app, BrowserWindow, protocol, ipcMain, shell } = require("electron");
const path = require("path");
const url = require("url");
const storage = require("electron-json-storage");
const vault = require("./vault");
const publisher = require("./publisher");
const safestorage = require('./storage');


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
      vault.createEntity(
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
      vault.authenticateEntity(
        {
          phone_number: phoneNumber,
          password: password,
          client_publish_pub_key: client_publish_pub_key,
          client_device_id_pub_key: client_device_id_pub_key,
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
  "list-entity-stored-tokens",
  async (
    event,
    {
     long_lived_token
    }
  ) => {
    return new Promise((resolve, reject) => {
      vault.listEntityStoredTokens(
        {
         long_lived_token: long_lived_token,
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
  "get-oauth2-authorization-url",
  async (
    event,
    {
      platform,
      state,
      code_verifier,
      autogenerate_code_verifier,
    }
  ) => {
    return new Promise((resolve, reject) => {
     publisher.getOAuth2AuthorizationUrl(
        {
          platform: platform,
          state: state,
          code_verifier: code_verifier,
          autogenerate_code_verifier: autogenerate_code_verifier,
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

ipcMain.handle("store-session", async (event, sessionData) => {
  return new Promise((resolve, reject) => {
    storage.set("userSession", sessionData, (error) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
});

ipcMain.handle("retrieve-session", async () => {
  return new Promise((resolve, reject) => {
    storage.get("userSession", (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
});

ipcMain.handle("delete-session", async () => {
  return new Promise((resolve, reject) => {
    storage.remove("userSession", (error) => {
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

ipcMain.handle("store-server-keys", async (event, { clientDeviceIdPrivKey, clientPublishPrivKey }) => {
  return new Promise((resolve, reject) => {
    try {
      const encryptedDeviceKey = safestorage.encryptString(clientDeviceIdPrivKey);
      const encryptedPublishKey = safestorage.encryptString(clientPublishPrivKey);
      storage.set("clientDeviceIdPrivKey", { data: encryptedDeviceKey }, (error) => {
        if (error) {
          reject(error);
        } else {
          storage.set("clientPublishPrivKey", { data: encryptedPublishKey }, (error) => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
});

ipcMain.handle("retrieve-server-keys", async () => {
  return new Promise((resolve, reject) => {
    storage.get("clientDeviceIdPrivKey", (error, deviceKeyData) => {
      if (error) {
        reject(error);
      } else {
        storage.get("clientPublishPrivKey", (error, publishKeyData) => {
          if (error) {
            reject(error);
          } else {
            try {
              const decryptedDeviceKey = safestorage.decryptString(deviceKeyData.data);
              const decryptedPublishKey = safestorage.decryptString(publishKeyData.data);
              resolve({
                clientDeviceIdPrivKey: decryptedDeviceKey,
                clientPublishPrivKey: decryptedPublishKey,
              });
            } catch (decryptionError) {
              reject(decryptionError);
            }
          }
        });
      }
    });
  });
});

ipcMain.handle("open-external-url", async (event, url) => {
  try {
    await shell.openExternal(url);
    event.returnValue = true; // Optional: return a value if needed
  } catch (error) {
    console.error("Failed to open external URL:", error);
    event.returnValue = false; // Optional: handle failure if needed
  }
});
