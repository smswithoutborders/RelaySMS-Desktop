const {
  app,
  BrowserWindow,
  Menu,
  shell,
  ipcMain,
  Notification,
} = require("electron");
const path = require("path");
const url = require("url");
const axios = require("axios");
const logger = require("../Logger");
const { registerIpcHandlers } = require("../main/ipcHandlers");

let mainWindow;
const SCHEMES = ["apps", "relaysms"];

const ALLOWED_DOMAINS = [
  'oauth.afkanerd.com',
  'relay.smswithoutborders.com',
  'smswithoutborders.com',
  'docs.smswithoutborders.com',
  'blog.smswithoutborders.com',
  'github.com',
  'twitter.com',
  'accounts.google.com',
  'bsky.social',
  'mastodon.social'
];

function isValidExternalUrl(urlString) {
  try {
    const url = new URL(urlString);
    
    if (!['https:', 'mailto:'].includes(url.protocol)) {
      logger.warn(`Blocked external URL with invalid protocol: ${url.protocol}`);
      return false;
    }
    
    if (url.protocol === 'mailto:') {
      return true;
    }
    
    const hostname = url.hostname.toLowerCase();
    const isAllowed = ALLOWED_DOMAINS.some(domain => 
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
    
    if (!isAllowed) {
      logger.warn(`Blocked external URL with non-whitelisted domain: ${hostname}`);
    }
    
    return isAllowed;
  } catch (error) {
    logger.error(`Invalid URL format: ${urlString}`, error.message);
    return false;
  }
}

SCHEMES.forEach((scheme) => {
  if (process.defaultApp) {
    if (process.argv.length >= 2) {
      app.setAsDefaultProtocolClient(scheme, process.execPath, [
        path.resolve(process.argv[1]),
      ]);
    }
  } else {
    app.setAsDefaultProtocolClient(scheme);
  }
});

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", (event, commandLine, _) => {
    if (mainWindow) {
      if (mainWindow.maximize()) mainWindow.restore();
      mainWindow.focus();
    }
    const deepLinkUrl = commandLine.find((arg) =>
      SCHEMES.some((scheme) => arg.startsWith(`${scheme}://`))
    );
    if (deepLinkUrl) {
      const parsed = url.parse(deepLinkUrl, true);
      if (parsed.query.code) {
        mainWindow.webContents.send("authorization-code", parsed.query.code);
      } else {
        logger.error("Authorization code not found");
      }
    }
  });

  app.whenReady().then(() => {
    createWindow();
    mainWindow.maximize();

    const deepLinkUrl = process.argv.find((arg) =>
      SCHEMES.some((scheme) => arg.startsWith(`${scheme}://`))
    );
    if (deepLinkUrl) {
      const parsed = url.parse(deepLinkUrl, true);
      if (parsed.query.code) {
        mainWindow.webContents.once("did-finish-load", () => {
          mainWindow.webContents.send("authorization-code", parsed.query.code);
        });
      }
    }
  });

  app.on("open-url", (event, url) => {
    event.preventDefault();
    const parsed = require("url").parse(url, true);
    if (parsed.query.code && mainWindow) {
      mainWindow.webContents.send("authorization-code", parsed.query.code);
    }
  });
}

async function createWindow() {
  ipcMain.handle("reload-window", () => {
    if (mainWindow) {
      mainWindow.reload();
    }
  });

  ipcMain.handle("notify-system", async (event, { title, body }) => {
    try {
      const iconPath = path.join(__dirname, "images/icon.png");

      new Notification({
        title,
        body,
        icon: iconPath,
      }).show();
      return { success: true };
    } catch (error) {
      logger.error("Failed to send notification:", error.message);
      throw error;
    }
  });

  registerIpcHandlers();

  ipcMain.handle("open-oauth-screen", async (event, { authorizationUrl }) => {
    if (isValidExternalUrl(authorizationUrl)) {
      shell.openExternal(authorizationUrl);
    } else {
      logger.error(`Blocked attempt to open invalid OAuth URL: ${authorizationUrl}`);
      throw new Error("Invalid or unauthorized URL");
    }
  });

  ipcMain.on("open-external-link", (event, url) => {
    if (url && isValidExternalUrl(url)) {
      shell.openExternal(url);
    } else {
      logger.error(`Blocked attempt to open invalid external link: ${url}`);
    }
  });

  ipcMain.handle("check-internet", async () => {
    try {
      await axios.get("https://1.1.1.1", {
        timeout: 10000,
      });
      return true;
    } catch (error) {
      return false;
    }
  });

  mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, "../main/preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
    },
    icon: path.join(__dirname, "images/icon.png"),
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
      {
        label: "Reload (Hard)",
        accelerator: isMac ? "Cmd+Shift+R" : "Ctrl+Shift+R",
        click: () => {
          if (mainWindow) {
            mainWindow.webContents.reloadIgnoringCache();
          }
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
          const url = "https://docs.smswithoutborders.com/";
          if (isValidExternalUrl(url)) {
            await shell.openExternal(url);
          }
        },
      },
      {
        label: "Support",
        click: async () => {
          const url = "mailto://developers@smswithoutborders.com";
          if (isValidExternalUrl(url)) {
            await shell.openExternal(url);
          }
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

const ALLOWED_NAVIGATION_ORIGINS = [
  'https://oauth.afkanerd.com',
  'https://smswithoutborders.com',
  'https://vault.smswithoutborders.com',
  'https://vault.staging.smswithoutborders.com',
  'https://publisher.smswithoutborders.com',
  'https://publisher.staging.smswithoutborders.com'
];

app.on("web-contents-created", (event, contents) => {
  contents.on("will-navigate", (event, navigationUrl) => {
    try {
      const parsedUrl = new URL(navigationUrl);
      
      const isAllowed = ALLOWED_NAVIGATION_ORIGINS.some(origin => 
        parsedUrl.origin === origin || 
        parsedUrl.origin.startsWith(origin)
      );

      if (!isAllowed) {
        logger.warn(`Blocked navigation to unauthorized URL: ${navigationUrl}`);
        event.preventDefault();
      }
    } catch (error) {
      logger.error(`Invalid navigation URL: ${navigationUrl}`, error.message);
      event.preventDefault();
    }
  });

  contents.setWindowOpenHandler(({ url }) => {
    try {
      const parsedUrl = new URL(url);
      const isAllowed = ALLOWED_NAVIGATION_ORIGINS.some(origin => 
        parsedUrl.origin === origin || 
        parsedUrl.origin.startsWith(origin)
      );

      if (isAllowed) {
        shell.openExternal(url);
      } else {
        logger.warn(`Blocked window open to unauthorized URL: ${url}`);
      }
    } catch (error) {
      logger.error(`Invalid window open URL: ${url}`, error.message);
    }
    
    return { action: 'deny' };
  });
});
