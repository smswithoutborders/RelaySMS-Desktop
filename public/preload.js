const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  createEntity: async (
    phoneNumber,
    password,
    country_code,
    client_device_id_pub_key,
    client_publish_pub_key,
    ownership_proof_response
  ) => {
    try {
      const response = await ipcRenderer.invoke("create-entity", {
        phoneNumber,
        password,
        country_code,
        client_publish_pub_key,
        client_device_id_pub_key,
        ownership_proof_response,
      });
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },
  authenticateEntity: async (
    phoneNumber,
    password,
    client_publish_pub_key,
    client_device_id_pub_key,
    ownership_proof_response
  ) => {
    try {
      const response = await ipcRenderer.invoke("authenticate-entity", {
        phoneNumber,
        password,
        client_publish_pub_key,
        client_device_id_pub_key,
        ownership_proof_response,
      });
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },
  storeParams: async (key, params) => {
    try {
      await ipcRenderer.invoke("store-params", { key, params });
    } catch (error) {
      console.error("Storage error:", error);
      throw error;
    }
  },
  retrieveParams: async (key) => {
    try {
      const params = await ipcRenderer.invoke("retrieve-params", { key });
      return params;
    } catch (error) {
      console.error("Retrieval error:", error);
      throw error;
    }
  },
});
