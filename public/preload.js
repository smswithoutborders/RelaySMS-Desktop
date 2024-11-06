const { contextBridge, ipcRenderer } = require("electron");
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = true;
console.log("Preload script loaded");

contextBridge.exposeInMainWorld("api", {
  storeParams: async (key, value) => {
    await ipcRenderer.invoke("store-params", { key, value });
  },
  retrieveParams: async (key) => {
    let value = await ipcRenderer.invoke("retrieve-params", key);
    return value;
  },
  logout: async () => {
    try {
      await ipcRenderer.invoke("logout");
      console.log("User logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  },

  openExternalLink: (url) => ipcRenderer.invoke("open-external-link", url),

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
      console.log("Create entity response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  authenticateEntity: async (
    phoneNumber,
    password,
    client_device_id_pub_key,
    client_publish_pub_key,
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
      console.error(error);
      throw error;
    }
  },

  resetPassword: async (
    phoneNumber,
    new_password,
    client_publish_pub_key,
    client_device_id_pub_key,
    ownership_proof_response
  ) => {
    try {
      const response = await ipcRenderer.invoke("reset-password", {
        phoneNumber,
        new_password,
        client_publish_pub_key,
        client_device_id_pub_key,
        ownership_proof_response,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  updateEntityPassword: async (
    current_password,
    long_lived_token,
    new_password
  ) => {
    try {
      const response = await ipcRenderer.invoke("update-entity-password", {
        current_password,
        long_lived_token,
        new_password,
      });
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getOAuth2AuthorizationUrl: async (
    platform,
    state,
    code_verifier,
    autogenerate_code_verifier,
    redirect_url
  ) => {
    try {
      const response = await ipcRenderer.invoke(
        "get-oauth2-authorization-url",
        {
          platform,
          state,
          code_verifier,
          autogenerate_code_verifier,
          redirect_url,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  exchangeOAuth2CodeAndStore: async (
    long_lived_token,
    platform,
    authorization_code,
    code_verifier,
    redirect_url
  ) => {
    try {
      const response = await ipcRenderer.invoke(
        "exchange-oauth2-code-and-store",
        {
          long_lived_token,
          platform,
          authorization_code,
          code_verifier,
          redirect_url,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  revokeAndDeleteOAuth2Token: async (
    long_lived_token,
    platform,
    account_identifier
  ) => {
    try {
      const response = await ipcRenderer.invoke(
        "revoke-and-delete-oauth2-token",
        {
          long_lived_token,
          platform,
          account_identifier,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  getPNBACode: async (phone_number, platform) => {
    try {
      const response = await ipcRenderer.invoke("get-pnba-code", {
        phone_number,
        platform,
      });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  exchangePNBACodeAndStore: async (
    authorization_code,
    long_lived_token,
    password,
    phone_number,
    platform
  ) => {
    try {
      const response = await ipcRenderer.invoke(
        "exchange-pnba-code-and-store",
        {
          authorization_code,
          long_lived_token,
          password,
          phone_number,
          platform,
        }
      );
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  listEntityStoredTokens: async (long_lived_token) => {
    try {
      const response = await ipcRenderer.invoke("list-entity-stored-tokens", {
        long_lived_token,
      });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  deleteEntity: async (long_lived_token) => {
    try {
      const response = await ipcRenderer.invoke("delete-entity", {
        long_lived_token,
      });
      console.log("response:", response);
      return response;
    } catch (error) {
      console.error(error);
      throw error;
    }
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

  openOauth: ({ oauthUrl }) => {
    console.log("authURL:", oauthUrl);
    return new Promise((resolve, reject) => {
      ipcRenderer.invoke("open-oauth", {
        oauthUrl,
      });
      ipcRenderer.once("authorization-code", (event, code) => {
        console.log("Auth Code", code);
        resolve(code);
      });
    });
  },

  retrieveLongLivedToken: ({
    client_device_id_secret_key,
    server_device_id_pub_key,
    long_lived_token_cipher,
  }) => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke("get-long-lived-token", {
          client_device_id_secret_key,
          server_device_id_pub_key,
          long_lived_token_cipher,
        })
        .then((decryptedToken) => {
          resolve(decryptedToken);
        })
        .catch((err) => {
          console.error("Error:", err.message);
          reject(err);
        });
    });
  },
  fetchGatewayClients: async () => {
    try {
      return await ipcRenderer.invoke("fetch-gateway-clients");
    } catch (error) {
      console.error("Error fetching gateway clients:", error);
      throw error;
    }
  },
  sendSMS: async ({ text, number }) => {
    try {
      console.log("Text", text);
      console.log("Number", number);
      return await ipcRenderer.invoke("send-sms", { text, number });
    } catch (error) {
      console.error("Error sending SMS:", error);
      throw error;
    }
  },
  fetchMessages: async () => {
    try {
      const messages = await ipcRenderer.invoke("fetch-messages");
      console.log("Fetched messages:", messages);
      return messages;
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  },
  encryptMessage: ({ content, phoneNumber, secretKey, publicKey }) => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke("encrypt-message", {
          content,
          phoneNumber,
          secretKey,
          publicKey,
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error("Error:", err.message);
          reject(err);
        });
    });
  },

  publishSharedSecret: ({
    client_publish_secret_key,
    server_publish_pub_key,
  }) => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke("publish-shared-secret", {
          client_publish_secret_key,
          server_publish_pub_key,
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error("Error:", err.message);
          reject(err);
        });
    });
  },

  createPayload: ({ encryptedContent, pl }) => {
    return new Promise((resolve, reject) => {
      ipcRenderer
        .invoke("create-payload", {
          encryptedContent,
          pl,
        })
        .then((result) => {
          resolve(result);
        })
        .catch((err) => {
          console.error("Error:", err.message);
          reject(err);
        });
    });
  },

bridgePayload: ({ contentSwitch, data }) => {
  return new Promise((resolve, reject) => {
    ipcRenderer
      .invoke("bridge-payload", {
        contentSwitch,
        data,
      })
      .then((result) => {
        console.log("bridgePayload:", result)
        resolve(result);
      })
      .catch((err) => {
        console.error("Error:", err.message);
        reject(err);
      });
  });
},
});

