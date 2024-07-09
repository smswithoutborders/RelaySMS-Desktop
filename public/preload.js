const { contextBridge, ipcRenderer } = require("electron");
const safestorage = require('./storage');

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
      console.log("Creating entity with the following details:");
      console.log("Phone Number:", phoneNumber);
      console.log("Country Code:", country_code);
      console.log("Client Device ID Pub Key:", client_device_id_pub_key);
      console.log("Client Publish Pub Key:", client_publish_pub_key);

      const response = await ipcRenderer.invoke("create-entity", {
        phoneNumber,
        password,
        country_code,
        client_publish_pub_key,
        client_device_id_pub_key,
        ownership_proof_response,
      });
      console.log("Create entity response:", response);
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
  // storeParams: async (key, params) => {
  //   try {
  //     await ipcRenderer.invoke("store-params", { key, params });
  //   } catch (error) {
  //     console.error("Storage error:", error);
  //     throw error;
  //   }
  // },
  // retrieveParams: async (key) => {
  //   try {
  //     const params = await ipcRenderer.invoke("retrieve-params", { key });
  //     return params;
  //   } catch (error) {
  //     console.error("Retrieval error:", error);
  //     throw error;
  //   }
  // },
  storeParams: (key, value) => safestorage.store(key, value),
  retrieveParams: (key) => safestorage.retrieve(key),
  storeOnboardingStep: async (step) => {
    try {
      await ipcRenderer.invoke("store-onboarding-step", step);
    } catch (error) {
      console.error("Storage error:", error);
      throw error;
    }
  },
  retrieveOnboardingStep: async () => {
    try {
      const step = await ipcRenderer.invoke("retrieve-onboarding-step");
      return step;
    } catch (error) {
      console.error("Retrieval error:", error);
      throw error;
    }
  },
  storeServerKeys: async (clientDeviceIdPrivKey, clientPublishPrivKey) => {
    try {
      await ipcRenderer.invoke("store-server-keys", { clientDeviceIdPrivKey, clientPublishPrivKey });
    } catch (error) {
      console.error("Storage error:", error);
      throw error;
    }
  },
  retrieveServerKeys: async () => {
    try {
      const keys = await ipcRenderer.invoke("retrieve-server-keys");
      return keys;
    } catch (error) {
      console.error("Retrieval error:", error);
      throw error;
    }
  },
  listEntityStoredTokens: async (long_lived_token) => {
    try {
      const response = await ipcRenderer.invoke("list-entity-stored-tokens", { long_lived_token });
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },
});
