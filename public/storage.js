const storage = new Map(); // Using an in-memory map for simplicity. Replace with actual secure storage.

module.exports = {
  store: (key, value) => {
    storage.set(key, value);
  },
  retrieve: (key) => {
    return storage.get(key);
  }
};
