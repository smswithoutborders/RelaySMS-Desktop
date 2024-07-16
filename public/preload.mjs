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
      console.log("Authenticating entity with the following details:");
      console.log("Phone Number:", phoneNumber);
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
  getOAuth2AuthorizationUrl: async (
    platform,
    state,
    code_verifier,
    autogenerate_code_verifier
  ) => {
    try {
      console.log("platform:", platform);
      console.log("state:", state);
      console.log("code_verifier", code_verifier);
      console.log("autogenerate_code_verifier", autogenerate_code_verifier);
      const response = await ipcRenderer.invoke(
        "get-oauth2-authorization-url",
        {
          platform,
          state,
          code_verifier,
          autogenerate_code_verifier,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },

  exchangeOAuth2CodeAndStore: async (
    long_lived_token,
    platform,
    authorization_code,
    code_verifier
  ) => {
    try {
      console.log("platform:", platform);
      console.log("long_lived_token:", long_lived_token);
      console.log("authorization_code", authorization_code);
      console.log("code_verifier", code_verifier);
      const response = await ipcRenderer.invoke(
        "exchange-oauth2-code-and-store",
        {
          long_lived_token,
          platform,
          authorization_code,
          code_verifier,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },
  listEntityStoredTokens: async (long_lived_token) => {
    try {
      console.log("long_lived_token:", long_lived_token);
      const response = await ipcRenderer.invoke("list-entity-stored-tokens", {
        long_lived_token,
      });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error("gRPC call error:", error);
      throw error;
    }
  },

  storeParams: async (key, value) => {
    console.log(">>>>> --", { key, value });
    await ipcRenderer.invoke("store-params", { key, value });
  },
  retrieveParams: async (key) => {
    return await ipcRenderer.invoke("retrieve-params", key);
  },

  storeSession: async (sessionData) => {
    try {
      await ipcRenderer.invoke("store-session", sessionData);
    } catch (error) {
      console.error("Session storage error:", error);
      throw error;
    }
  },

  retrieveSession: async () => {
    try {
      const sessionData = await ipcRenderer.invoke("retrieve-session");
      return sessionData;
    } catch (error) {
      console.error("Session retrieval error:", error);
      throw error;
    }
  },

  deleteSession: async () => {
    try {
      await ipcRenderer.invoke("delete-session");
    } catch (error) {
      console.error("Session deletion error:", error);
      throw error;
    }
  },

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
 
  openOauth: ({ oauthUrl, expectedRedirect }) => {
    console.log("r_url", expectedRedirect);
    console.log("authURL:", oauthUrl);
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke("open-oauth", {
        oauthUrl,
        expectedRedirect,
      });
      ipcRenderer.once("authorization-code", (event, code) => {
        console.log("Auth Code", code);
        resolve(code);
      });
    });
  },
});
