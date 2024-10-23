/* eslint-disable no-unused-expressions */
const { app, BrowserWindow, ipcMain, Menu, shell } = require("electron");
const path = require("path");
const url = require("url");
const axios = require("axios");
const { execSync, execFile, exec } = require("child_process");
const fs = require("fs-extra");
const os = require("os");

const {
  decryptLongLivedToken,
  publishSharedSecret,
  createPayload,
} = require("../src/Cryptography.js");

const vault = require("./vault.js");
const publisher = require("./publisher.js");

let mainWindow;

let storage;

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("apps", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("apps");
}

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
    const deepLinkUrl = commandLine.find((arg) => arg.startsWith("apps://"));
    if (deepLinkUrl) {
      const parsed = url.parse(deepLinkUrl, true);
      if (parsed.query.code) {
        mainWindow.webContents.send("authorization-code", parsed.query.code);
      } else {
        console.error("Authorization code not found");
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();
  });
}

async function loadModules() {
  const Store = (await import("electron-store")).default;
  storage = new Store({ name: "relaysms" });
}

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

ipcMain.handle("open-oauth", async (event, { oauthUrl }) => {
  shell.openExternal(oauthUrl);
});

ipcMain.handle(
  "get-oauth2-authorization-url",
  async (
    event,
    { platform, state, code_verifier, autogenerate_code_verifier, redirect_url }
  ) => {
    return new Promise((resolve, reject) => {
      publisher.getOAuth2AuthorizationUrl(
        {
          platform,
          state,
          code_verifier,
          autogenerate_code_verifier,
          redirect_url,
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
    {
      long_lived_token,
      platform,
      authorization_code,
      code_verifier,
      redirect_url,
    }
  ) => {
    return new Promise((resolve, reject) => {
      publisher.exchangeOAuth2CodeAndStore(
        {
          long_lived_token,
          platform,
          authorization_code,
          code_verifier,
          redirect_url,
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
        const modemIndex = modems[0].index;
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

const homeDir = os.homedir();

const baseDir = path.join(homeDir, ".local", "share", "relaysms");

console.log(baseDir);

function encryptMessage({ content, phoneNumber, secretKey, publicKey }) {
  return new Promise((resolve, reject) => {
    const pythonPath = path.join(baseDir, "venv", "bin", "python3");
    const cliPath = path.join(baseDir, "py_double_ratchet_cli/cli.py");
    console.log("pythonPath", pythonPath);
    console.log("cliPath", cliPath);

    const command = `${pythonPath} ${cliPath} -c "${content}" -p "${phoneNumber}" -s "${secretKey}" -k "${publicKey}"`;

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
    try {
      const result = await encryptMessage({
        content: content,
        phoneNumber: phoneNumber,
        secretKey: secretKey,
        publicKey: publicKey,
      });
      return result;
    } catch (error) {
      throw new Error(`Encryption failed: ${error}`);
    }
  }
);

ipcMain.handle(
  "publish-shared-secret",
  async (event, { client_publish_secret_key, server_publish_pub_key }) => {
    try {
      const result = await publishSharedSecret(
        client_publish_secret_key,
        server_publish_pub_key
      );
      return result;
    } catch (err) {
      console.error("Error:", err.message);
      throw err;
    }
  }
);
ipcMain.handle("logout", async () => {
  try {
    if (fs.existsSync(storage.path)) {
      await fs.remove(storage.path);
      console.log("relaysms file deleted successfully");

      storage.clear();

      return { success: true, message: "Logged out successfully" };
    } else {
      console.error("relaysms file does not exist");
      return { success: false, message: "No relaysms file found" };
    }
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, message: "Logout failed due to an error" };
  }
});

ipcMain.handle("create-payload", async (event, { encryptedContent, pl }) => {
  try {
    const result = createPayload(encryptedContent, pl);
    console.log("payload:", result);
    return result;
  } catch (err) {
    console.error("Error:", err.message);
    throw err;
  }
});

ipcMain.handle("open-external-link", (event, url) => {
  shell.openExternal(url);
});

async function createWindow() {
  await loadModules();

  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
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

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

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

const allowedNavigationDestinations = "https://oauth.afkanerd.com/";
app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);

    if (!allowedNavigationDestinations.includes(parsedUrl.origin)) {
      event.preventDefault();
    }
  });
});

  exec('sudo apt-get install -y curl', (err, stdout, stderr) => {
    if (err) {
      console.error(`Error installing curl on Linux: ${err.message}`);
      return;
    }
    log(stdout);
  });

const venvDir = path.join(baseDir, "venv");
const setupFlagFile = path.join(baseDir, "setup_done.flag");
const cliRepoDir = path.join(baseDir, "py_double_ratchet_cli");
const logFile = "/tmp/postinstall_log.txt";

// Log function
function log(message) {
  fs.appendFileSync(logFile, message + "\n");
}

// Check if Python is installed
function isPythonInstalled() {
  try {
    execSync("python3 --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    console.error(
      "Python 3 is not installed. Please install Python 3 to continue."
    );
    log("Python 3 is not installed. Please install Python 3 to continue.");
    return false;
  }
}

// Check if Git is installed
function isGitInstalled() {
  try {
    execSync("git --version", { stdio: "ignore" });
    return true;
  } catch (error) {
    log("Git is not installed, falling back to curl for CLI installation.");
    return false;
  }
}

// Download repository using curl if Git is not available
function downloadCLIWithCurl() {
  try {
    log("Downloading CLI using curl...");
    const zipPath = path.join(baseDir, "py_double_ratchet_cli.zip");
    execSync(
      `curl -L https://github.com/smswithoutborders/py_double_ratchet_cli/main.zip -o ${zipPath}`
    );

    // Unzip the downloaded file
    execSync(`unzip ${zipPath} -d ${baseDir}`);
    // Rename the extracted folder to match the expected directory name
    fs.renameSync(path.join(baseDir, "py_double_ratchet_cli-main"), cliRepoDir);

    log("CLI downloaded and extracted successfully.");
  } catch (error) {
    log("Failed to download CLI with curl:", error);
    throw new Error("CLI installation failed.");
  }
}

// Perform setup
function setupPythonEnvironment() {
  if (!isPythonInstalled()) {
    return;
  }

  if (fs.existsSync(setupFlagFile)) {
    log("Python environment setup has already been completed.");
    return;
  }

  log("Setting up Python environment...");

  // Ensure Python directory exists
  fs.mkdirSync(baseDir, { recursive: true });

  // Clone the repository or download with curl
  try {
    if (!fs.existsSync(cliRepoDir)) {
      if (isGitInstalled()) {
        execSync(
          `git clone https://github.com/smswithoutborders/py_double_ratchet_cli.git ${cliRepoDir}`,
          { stdio: "inherit" }
        );
      } else {
        downloadCLIWithCurl(); // Use curl to download CLI
      }
    }
  } catch (error) {
    log("Error during repository setup:", error);
    return;
  }

  try {
    execSync(
      `python3 -m venv ${venvDir} && ${venvDir}/bin/python3 -m pip install -r ${path.join(
        cliRepoDir,
        "requirements.txt"
      )}`,
      { stdio: "inherit" }
    );
  } catch (error) {
    log("Failed to Setup Virtual Environment:", error);
    return;
  }

  // Create a flag file to indicate setup is done
  fs.writeFileSync(setupFlagFile, "Python environment setup completed.");
}

// Run the setup function
setupPythonEnvironment();
