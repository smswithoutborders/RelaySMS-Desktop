export default class SettingsController {
  constructor(key = "appSettings") {
    this.key = key;
    this.settings = this.getSettings();
  }

  getSettings() {
    const storedSettings = localStorage.getItem(this.key);
    return storedSettings ? JSON.parse(storedSettings) : {};
  }

  saveSettings() {
    localStorage.setItem(this.key, JSON.stringify(this.settings));
  }

  setSetting(path, value) {
    const keys = path.split(".");
    let current = this.settings;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        current[key] = value;
      } else {
        current[key] = current[key] || {};
        current = current[key];
      }
    });

    this.saveSettings();
  }

  getSetting(path) {
    const keys = path.split(".");
    let current = this.settings;

    for (const key of keys) {
      if (current[key] === undefined) {
        console.error(`Setting '${path}' does not exist.`);
        return null;
      }
      current = current[key];
    }

    return current;
  }

  deleteSetting(path) {
    const keys = path.split(".");
    let current = this.settings;

    keys.forEach((key, index) => {
      if (index === keys.length - 1) {
        delete current[key];
      } else {
        if (!current[key]) {
          console.error(`Setting '${path}' does not exist.`);
          return;
        }
        current = current[key];
      }
    });

    this.saveSettings();
  }

  getAllSettings() {
    return this.settings;
  }

  clearSettings() {
    localStorage.removeItem(this.key);
    this.settings = {};
  }
}
