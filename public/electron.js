/* eslint-disable no-unused-expressions */
const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  Menu,
  shell,
} = require("electron");
const path = require("path");
const url = require("url");
const axios = require("axios");
const { execSync, execFile } = require("child_process");
const fs = require("fs-extra");

const OAuth2Handler = require(path.join(__dirname, "../src/OAuthHandler.js"));
const {
  decryptLongLivedToken,
  publishSharedSecret,
  createPayload,
} = require("../src/Cryptography.js");

const vault = require("./vault.js");
const publisher = require("./publisher.js");

let mainWindow;

let storage;

async function loadModules() {
  const Store = (await import("electron-store")).default;
  storage = new Store({ name: "relaysms" });
}



async function createWindow() {
  await loadModules();

  console.log("Creating main window...");
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
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

  app.whenReady().then(() => {
    // Register a custom protocol
    protocol.registerFileProtocol('relaydesktop', (request, callback) => {
      const url = request.url.substr(7); // Remove 'myapp://' prefix
      const parsedUrl = new URL(url);
  
      // Handle different paths in your app
      if (parsedUrl.pathname === '/auth-callback') {
        // Handle the OAuth2 callback here
        // Extract the auth code or tokens from the URL
        const authCode = parsedUrl.searchParams.get('code');
        console.log('Authorization Code:', authCode);
        // Do something with the auth code, like exchanging it for tokens
      }
  
      // Optionally, you can load a local file or serve specific content
      callback({ path: path.normalize(`${__dirname}/index.html`) });
    });
  });
}

function setupLocalFilesNormalizerProxy() {
  protocol.registerHttpProtocol(
    "file",
    (request, callback) => {
      const pathname = decodeURI(request.url.substr(7));
      const normalizedPath = path.normalize(pathname);
      callback({ path: normalizedPath });
    },
    (error) => {
      if (error) console.error("Failed to register protocol:", error);
    }
  );
}

const isMac = process.platform === "darwin";
const template = [
  ...(isMac ? [{ role: "appMenu" }] : []),
  {
    label: "File",
    submenu: [{ role: "close" }],
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
    ],
  },
  {
    label: "View",
    submenu: [
      {
        label: "Toggle Full Screen",
        accelerator: isMac ? "Ctrl+Command+F" : "F11",
        click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        },
      },
      { role: "reload" },
      { role: "toggledevtools" },
    ],
  },
  {
    label: "Help",
    submenu: [
      {
        label: "Documentation",
        click: async () => {
          await shell.openExternal("https://docs.smswithoutborders.com/");
        },
      },
      {
        label: "Support",
        click: async () => {
          await shell.openExternal("mailto://developers@smswithoutborders.com");
        },
      },
      {
        label: "About",
        click: () => {
          const options = {
            type: "info",
            buttons: ["OK"],
            title: "About",
            message: "Your Electron App\nVersion 1.0.0",
            detail: "Your app details here.",
          };
          require("electron").dialog.showMessageBox(mainWindow, options);
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.whenReady().then(() => {
  createWindow();
  setupLocalFilesNormalizerProxy();
  app.setAsDefaultProtocolClient('relaydesktop');

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

const pythonDir = path.join(__dirname, "../resources/python");
const venvDir = path.join(pythonDir, "venv");
const setupFlagFile = path.join(pythonDir, "setup_done.flag");
const cliRepoDir = path.join(pythonDir, "py_double_ratchet_cli");
// Function to perform setup
function setupPythonEnvironment() {
  if (fs.existsSync(setupFlagFile)) {
    console.log("Python environment setup has already been completed.");
    return;
  }

  console.log("Setting up Python environment...");

  // Ensure Python directory exists
  fs.mkdirSync(pythonDir, { recursive: true });

  // Clone the repository if it doesn't exist
  if (!fs.existsSync(cliRepoDir)) {
    execSync(
      `git clone https://github.com/smswithoutborders/py_double_ratchet_cli.git ${cliRepoDir}`,
      { stdio: "inherit" }
    );
  }

  // Create a virtual environment
  execSync(`python3 -m venv ${venvDir}`, { stdio: "inherit" });

  // Install requirements
  execSync(
    `. ${path.join(venvDir, "bin/activate")} && pip install -r ${path.join(
      cliRepoDir,
      "requirements.txt"
    )}`,
    { stdio: "inherit" }
  );

  // Create a flag file to indicate setup is done
  fs.writeFileSync(setupFlagFile, "Python environment setup completed.");
}

// Run the setup function
setupPythonEnvironment();

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
  async (event, { current_password, long_lived_token, new_password }) => {
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
    console.log("main llt:", long_lived_token);
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

ipcMain.handle("delete-entity", async (event, { long_lived_token }) => {
  return new Promise((resolve, reject) => {
    vault.deleteEntity(
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
});

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
  async (event, { long_lived_token, platform, account_identifier }) => {
    return new Promise((resolve, reject) => {
      publisher.revokeAndDeleteOAuth2Token(
        {
          long_lived_token: long_lived_token,
          platform: platform,
          account_identifier: account_identifier,
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

ipcMain.handle("get-pnba-code", async (event, { phone_number, platform }) => {
  return new Promise((resolve, reject) => {
    publisher.getPNBACode(
      {
        phone_number: phone_number,
        platform: platform,
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
});

ipcMain.handle(
  "exchange-pnba-code-and-store",
  async (
    event,
    { authorization_code, long_lived_token, password, phone_number, platform }
  ) => {
    return new Promise((resolve, reject) => {
      publisher.exchangePNBACodeAndStore(
        {
          authorization_code: authorization_code,
          long_lived_token: long_lived_token,
          password: password,
          phone_number: phone_number,
          platform: platform,
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
    return params;
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

ipcMain.handle("fetch-gateway-clients", async () => {
  try {
    const response = await axios.get(
      "https://smswithoutborders.com:15000/v3/clients"
    );
    const clients = response.data.map((client) => ({
      operator: client.operator,
      msisdn: client.msisdn,
      country: client.country,
    }));
    return clients;
  } catch (error) {
    console.error("Error fetching gateway clients:", error);
    throw error;
  }
});

ipcMain.handle("send-sms", async (event, { text, number }) => {
  try {
    console.log(
      "Attempting to send SMS with text:",
      text,
      "and number:",
      number
    );

    // Check system state
    const stateResponse = await axios.get("http://localhost:6868/system/state");
    console.log("System state response:", stateResponse.data);

    if (stateResponse.data && stateResponse.data.outbound === "active") {
      // Get modems
      const modemsResponse = await axios.get("http://localhost:6868/modems");
      console.log("Modems response:", modemsResponse.data);

      const modems = modemsResponse.data;

      if (modems.length > 0) {
        const modemIndex = modems[0].index; // Assuming using the first modem found
        console.log("Using modem index:", modemIndex);

        // Send SMS
        const smsResponse = await axios.post(
          `http://localhost:6868/modems/${modemIndex}/sms`,
          { text, number }
        );
        console.log("SMS response:", smsResponse);
        return smsResponse.data;
      } else {
        console.error("No active modems found");
        throw new Error("No active modems found");
      }
    } else {
      console.error("System not active");
      throw new Error("System not active");
    }
  } catch (error) {
    console.error("Error sending SMS:", error);
    throw error;
  }
});

function encryptMessage({content, phoneNumber, secretKey, publicKey}) {
  return new Promise((resolve, reject) => {
    const pythonDir = path.join(__dirname, "../resources/python");
    const venvActivate = path.join(pythonDir, "venv/bin/activate");
    const cliPath = path.join(pythonDir, "py_double_ratchet_cli/cli.py");
    console.log("You got here, hurray!")
    // Command to run the CLI
    const command = `source ${venvActivate} && python3 ${cliPath} -c "${content}" -p "${phoneNumber}" -s "${secretKey}" -k "${publicKey}"`;

    execFile("bash", ["-c", command], (error, stdout, stderr) => {
      if (error) {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

ipcMain.handle(
  "encrypt-message",
  async (event, { content, phoneNumber, secretKey, publicKey }) => {
    console.log(">>>1")
    try {
      const result = await encryptMessage({
        content: content,
        phoneNumber: phoneNumber,
        secretKey: secretKey,
        publicKey: publicKey
    });
    console.log(">>>2")
      return result;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }
);

ipcMain.handle(
  "publish-shared-secret",
  async (event, { client_publish_secret_key, server_publish_pub_key }) => {
    console.log("publish-shared-client_publish_secret_key:", client_publish_secret_key);
    console.log("publish-server_publish_pub_key-secret:", server_publish_pub_key);
    try {
      const result = publishSharedSecret(
        client_publish_secret_key,
        server_publish_pub_key
      );
      console.log("publish-shared-secret:", result);
      return result;
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }
);

ipcMain.handle(
  "create-payload",
  async (event, { encryptedContent, pl }) => {
    console.log("encryptedContent:", encryptedContent);
    console.log("pl:", pl);
    try {
      const result = createPayload(
        encryptedContent,
        pl
      );
      console.log("payload:", result);
      return result;
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }
);


