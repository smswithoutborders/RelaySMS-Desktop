/* eslint-disable no-unused-expressions */
import { app, BrowserWindow, protocol, ipcMain } from "electron";
import path from "path";
import url from "url";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Store from "electron-store";
import OAuth2Handler from "../src/OAuthHandler.js";
import { decryptLongLivedToken} from "../src/Cryptography.js";

const storage = new Store({ name: "relaysms" });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.mjs"),
      nodeIntegration: false,
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

app.whenReady().then(async () => {
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

let vault;
let publisher;

async function loadModules() {
  vault = await import("./vault.js");
  publisher = await import("./publisher.js");
}

loadModules();

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
  "reset-password",
  async (
    event,
    {
      phoneNumber,
      new_password,
      client_publish_pub_key,
      client_device_id_pub_key,
      ownership_proof_response,
    }
  ) => {
    return new Promise((resolve, reject) => {
      vault.resetPassword(
        {
          phone_number: phoneNumber,
          new_password: new_password,
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
  "update-entity-password",
  async (
    event,
    {
      current_password,
      long_lived_token,
      new_password,
    }
  ) => {
    return new Promise((resolve, reject) => {
      vault.updateEntityPassword(
        {
          current_password: current_password,
          long_lived_token: long_lived_token,
          new_password: new_password,         
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
  async (event, { long_lived_token }) => {
    console.log("main llt:", long_lived_token)
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
  "delete-entity",
  async (event, { long_lived_token }) => {
    return new Promise((resolve, reject) => {
      vault.DeleteEntity(
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
    { platform, state, code_verifier, autogenerate_code_verifier }
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

ipcMain.handle(
  "exchange-oauth2-code-and-store",
  async (
    event,
    { long_lived_token, platform, authorization_code, code_verifier }
  ) => {
    return new Promise((resolve, reject) => {
      publisher.exchangeOAuth2CodeAndStore(
        {
          long_lived_token: long_lived_token,
          platform: platform,
          authorization_code: authorization_code,
          code_verifier: code_verifier,
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
  "revoke-and-delete-oauth2-token",
  async (
    event,
    { long_lived_token, platform, account_identifier}
  ) => {
    return new Promise((resolve, reject) => {
      publisher.RevokeAndDeleteOAuth2Token(
        {
          long_lived_token: long_lived_token,
          platform: platform,
          account_identifier: account_identifier
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

ipcMain.handle("store-params", async (event, { key, value }) => {
  try {
    storage.set(key, value);
    return true;
  } catch (error) {
    console.error("Error storing params:", error);
    throw error;
  }
});

ipcMain.handle("retrieve-params", async (event, key) => {
  try {
   const params = storage.get(key);
   return params
  } catch (error) {
    console.error("Error retrieving params:", error);
    throw error;
  }
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

ipcMain.handle("open-oauth", async (event, { oauthUrl, expectedRedirect }) => {
  const oauthClient = new OAuth2Handler();

  const code = await oauthClient.openAuthWindowAndGetAuthorizationCode(
    oauthUrl,
    expectedRedirect
  );

  mainWindow.webContents.send("authorization-code", code);
});

ipcMain.handle(
  "get-long-lived-token",
  async (
    event,
    {
      client_device_id_secret_key,
      server_device_id_pub_key,
      long_lived_token_cipher,
    }
  ) => {
    try {
      const decryptedToken = await decryptLongLivedToken(
        client_device_id_secret_key,
        server_device_id_pub_key,
        long_lived_token_cipher
      );
      console.log("Decrypted Token:", decryptedToken);
      return decryptedToken;
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }
);
