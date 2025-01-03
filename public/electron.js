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
  app.on("second-instance", (event, commandLine, _) => {
    if (mainWindow) {
      if (mainWindow.maximize()) mainWindow.restore();
      mainWindow.focus();
    }
    const deepLinkUrl = commandLine.find((arg) => arg.startsWith("apps://"));
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
    shell.openExternal(authorizationUrl);
  });

  ipcMain.on("open-external-link", (event, url) => {
    if (url) {
      shell.openExternal(url);
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
