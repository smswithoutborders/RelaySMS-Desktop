export default class UserController {
  constructor(key = "userData") {
    this.key = key;
  }

  getUserData() {
    const storedData = localStorage.getItem(this.key);
    return storedData ? JSON.parse(storedData) : null;
  }

  setUserData(newData) {
    const token = newData.token || this.generateToken();
    const updatedData = { ...newData, token };
    localStorage.setItem(this.key, JSON.stringify(updatedData));
  }

  clearUserData() {
    localStorage.removeItem(this.key);
  }

  generateToken() {
    return Math.random().toString(36).substring(2);
  }
}
