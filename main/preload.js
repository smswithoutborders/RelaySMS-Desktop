const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },

  invoke: (channel, ...args) => {
    return ipcRenderer.invoke(channel, ...args);
  },

  on: (channel, listener) => {
    ipcRenderer.on(channel, listener);
  },

  removeListener: (channel, listener) => {
    ipcRenderer.removeListener(channel, listener);
  },

  once: (channel) => {
    return new Promise((resolve, reject) => {
      ipcRenderer.once(channel, (event, data) => {
        if (data) {
          resolve(data);
        } else {
          reject(new Error("No data received"));
        }
      });
    });
  },
});
