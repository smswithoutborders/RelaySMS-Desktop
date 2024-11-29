export default class MessageController {
  constructor(table = "messages") {
    this.table = table;
  }

  async _performDBOperation(operation, ...args) {
    try {
      const result = await operation(...args);
      return result;
    } catch (error) {
      console.error(`Error performing database operation:`, error);
      return null;
    }
  }

  getAllData() {
    return this._performDBOperation(() =>
      window.api.invoke("db-get-all", this.table)
    );
  }

  getData(path) {
    return this._performDBOperation(() =>
      window.api.invoke("db-get", this.table, path)
    );
  }

  setData(path, value) {
    return this._performDBOperation(() =>
      window.api.invoke("db-set", this.table, path, value)
    );
  }

  deleteData(path) {
    return this._performDBOperation(() =>
      window.api.invoke("db-delete", this.table, path)
    );
  }

  deleteTable() {
    return this._performDBOperation(() =>
      window.api.invoke("db-delete-table", this.table)
    );
  }
}
