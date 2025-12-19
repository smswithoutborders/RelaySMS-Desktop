const { contextBridge, ipcRenderer } = require("electron");

const ALLOWED_CHANNELS = {
  invoke: [
    // Vault operations
    'CreateEntity',
    'AuthenticateEntity',
    'EntityLogin',
    'UpdateEntityPassword',
    'DeleteEntity',
    'VerifyOwnershipProof',
    'RequestOwnershipCode',
    'ResetPassword',
    'ListEntityStoredTokens',
    'ExchangeOAuth2CodeAndStore',
    'RevokeAndDeleteOAuth2Token',
    'GetPNBACode',
    'ExchangePNBACodeAndStore',
    'RevokeAndDeletePNBAToken',
    
    // Publisher operations
    'GetUserPlatforms',
    'StoreContent',
    'GetOAuth2AuthorizationUrl',
    
    // Database operations
    'db-get',
    'db-set',
    'db-delete',
    'db-get-all',
    'db-delete-table',
    
    // Crypto operations
    'generate-keypair',
    'derive-secret-key',
    'decrypt-long-lived-token',
    'encrypt-payload',
    'create-transmission-payload',
    'compute-device-id',
    'clear-ratchet-state',
    
    // System operations
    'reload-window',
    'notify-system',
    'open-oauth-screen',
    'check-internet'
  ],
  send: [
    'open-external-link'
  ],
  on: [
    'authorization-code'
  ]
};

function isValidChannel(channel, operation) {
  const allowedList = ALLOWED_CHANNELS[operation];
  return allowedList && allowedList.includes(channel);
}

contextBridge.exposeInMainWorld("api", {
  send: (channel, data) => {
    if (!isValidChannel(channel, 'send')) {
      throw new Error(`Unauthorized IPC channel: ${channel}`);
    }
    ipcRenderer.send(channel, data);
  },

  invoke: (channel, ...args) => {
    if (!isValidChannel(channel, 'invoke')) {
      throw new Error(`Unauthorized IPC channel: ${channel}`);
    }
    return ipcRenderer.invoke(channel, ...args);
  },

  on: (channel, listener) => {
    if (!isValidChannel(channel, 'on')) {
      throw new Error(`Unauthorized IPC channel: ${channel}`);
    }
    ipcRenderer.on(channel, listener);
  },

  removeListener: (channel, listener) => {
    if (!isValidChannel(channel, 'on')) {
      throw new Error(`Unauthorized IPC channel: ${channel}`);
    }
    ipcRenderer.removeListener(channel, listener);
  },

  once: (channel) => {
    if (!isValidChannel(channel, 'on')) {
      return Promise.reject(new Error(`Unauthorized IPC channel: ${channel}`));
    }
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
