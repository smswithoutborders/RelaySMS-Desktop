const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  createEntity: async (phoneNumber, password) => {
    try {
      const response = await ipcRenderer.invoke("create-entity", {
        phoneNumber,
        password,
      });
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },
});
