const Database = require("better-sqlite3");
const { app } = require("electron");
const path = require("path");

class DB {
  constructor(dbName) {
    const userDataPath = app.getPath("userData");
    this.dbPath = path.join(userDataPath, dbName);
    this.db = null;
  }

  _getDBInstance() {
    if (!this.db) {
      this.db = new Database(this.dbPath);
      this.db.pragma("journal_mode = WAL");
    }
    return this.db;
  }

  _createTableIfNotExists(table) {
    const db = this._getDBInstance();
    try {
      const query = `
        CREATE TABLE IF NOT EXISTS ${this._sanitizeIdentifier(table)} (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT UNIQUE,
          value TEXT
        )
      `;
      db.exec(query);
    } catch (error) {
      throw new Error(
        `Error ensuring table '${table}' exists: ${error.message}`
      );
    }
  }

  getAll(table) {
    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const query = `SELECT key, value FROM ${this._sanitizeIdentifier(table)}`;
      const stmt = db.prepare(query);
      const rows = stmt.all();
      return rows.map((row) => ({
        key: row.key,
        value: JSON.parse(row.value),
      }));
    } catch (error) {
      throw new Error(
        `Error fetching all records from '${table}': ${error.message}`
      );
    }
  }

  get(table, path) {
    if (!path) throw new Error("Path cannot be empty.");

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);

      const query = jsonPath
        ? `
          SELECT json_extract(value, ?) AS result
          FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `
        : `
          SELECT value 
          FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `;

      const stmt = db.prepare(query);
      const params = jsonPath ? [`$.${jsonPath}`, key] : [key];
      const result = stmt.get(...params)?.result || stmt.get(...params)?.value;

      return result ? JSON.parse(result) : null;
    } catch (error) {
      throw new Error(
        `Error fetching data from '${table}' with path '${path}': ${error.message}`
      );
    }
  }

  set(table, path, value) {
    if (!path) throw new Error("Path cannot be empty.");

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);
      const serializedValue = JSON.stringify(value);

      const query = jsonPath
        ? `
          INSERT INTO ${this._sanitizeIdentifier(table)} (key, value)
          VALUES (?, json_set(json('{}'), ?, ?))
          ON CONFLICT(key) DO UPDATE SET value = json_set(value, ?, ?)
        `
        : `
          INSERT INTO ${this._sanitizeIdentifier(table)} (key, value)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = ?
        `;

      const stmt = db.prepare(query);
      const params = jsonPath
        ? [
            key,
            `$.${jsonPath}`,
            serializedValue,
            `$.${jsonPath}`,
            serializedValue,
          ]
        : [key, serializedValue, serializedValue];

      stmt.run(...params);
    } catch (error) {
      throw new Error(
        `Error inserting/updating data in '${table}' with path '${path}': ${error.message}`
      );
    }
  }

  delete(table, path) {
    if (!path) throw new Error("Path cannot be empty.");

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);

      const query = jsonPath
        ? `
          UPDATE ${this._sanitizeIdentifier(table)}
          SET value = json_remove(value, ?)
          WHERE key = ?
        `
        : `
          DELETE FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `;

      const stmt = db.prepare(query);
      const params = jsonPath ? [`$.${jsonPath}`, key] : [key];

      stmt.run(...params);
    } catch (error) {
      throw new Error(
        `Error deleting data in '${table}' with path '${path}': ${error.message}`
      );
    }
  }

  deleteTable(table) {
    const db = this._getDBInstance();
    try {
      const query = `DROP TABLE IF EXISTS ${this._sanitizeIdentifier(table)}`;
      db.exec(query);
    } catch (error) {
      throw new Error(`Error deleting table '${table}': ${error.message}`);
    }
  }

  _splitPath(path) {
    const [key, ...rest] = path.split(".");
    if (!key) throw new Error("Path must include a key.");
    const jsonPath = rest.length > 0 ? rest.join(".") : null;
    return [key, jsonPath];
  }

  _sanitizeIdentifier(identifier) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
      throw new Error(`Invalid table or column name: '${identifier}'`);
    }
    return identifier;
  }

  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

module.exports = DB;
