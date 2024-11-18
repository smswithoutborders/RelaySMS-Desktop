const Database = require("better-sqlite3");
const { app } = require("electron");
const path = require("path");
const logger = require("../Logger");

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
      logger.info(`Database connection established at ${this.dbPath}`);
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
          value JSON
        )
      `;
      db.exec(query);
    } catch (error) {
      logger.error(`Error ensuring table '${table}' exists:`, error);
    }
  }

  getAll(table) {
    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const query = `SELECT * FROM ${this._sanitizeIdentifier(table)}`;
      logger.info(`Executing query: ${query}`);
      const stmt = db.prepare(query);
      const rows = stmt.all();
      return rows;
    } catch (error) {
      logger.error(`Error fetching all records from table '${table}':`, error);
      return [];
    }
  }

  get(table, path) {
    if (!path) {
      logger.error("Path cannot be empty.");
      return null;
    }

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);
      let query;

      if (jsonPath === null) {
        query = `
          SELECT value FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `;
      } else {
        query = `
          SELECT json_extract(value, ?) AS result
          FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `;
      }

      logger.info(
        `Executing query: ${query} with params: [${
          jsonPath === null ? key : `$.${jsonPath}`
        }, ${key}]`
      );
      const stmt = db.prepare(query);
      const result = stmt.get(jsonPath === null ? key : `$.${jsonPath}`, key);
      return result ? result.result : null;
    } catch (error) {
      logger.error(
        `Error fetching data from table '${table}' with path '${path}':`,
        error
      );
      return null;
    }
  }

  set(table, path, value) {
    if (!path) {
      logger.error("Path cannot be empty.");
      return;
    }

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);
      let query;

      if (jsonPath === null) {
        query = `
          INSERT INTO ${this._sanitizeIdentifier(table)} (key, value)
          VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value = ?
        `;
        logger.info(
          `Executing query: ${query} with params: [${key}, ${JSON.stringify(
            value
          )}, ${JSON.stringify(value)}]`
        );
        const stmt = db.prepare(query);
        stmt.run(key, JSON.stringify(value), JSON.stringify(value));
      } else {
        query = `
          INSERT INTO ${this._sanitizeIdentifier(table)} (key, value)
          VALUES (?, json_set(json('{}'), ?, json(?)))
          ON CONFLICT(key) DO UPDATE SET value = json_set(value, ?, json(?))
        `;
        logger.info(
          `Executing query: ${query} with params: [${key}, ${`$.${jsonPath}`}, ${JSON.stringify(
            value
          )}]`
        );
        const stmt = db.prepare(query);
        stmt.run(
          key,
          `$.${jsonPath}`,
          JSON.stringify(value),
          `$.${jsonPath}`,
          JSON.stringify(value)
        );
      }
    } catch (error) {
      logger.error(
        `Error inserting/updating data in table '${table}' with path '${path}':`,
        error
      );
    }
  }

  delete(table, path) {
    if (!path) {
      logger.error("Path cannot be empty.");
      return;
    }

    this._createTableIfNotExists(table);
    const db = this._getDBInstance();
    try {
      const [key, jsonPath] = this._splitPath(path);
      let query;

      if (jsonPath === null) {
        query = `
          DELETE FROM ${this._sanitizeIdentifier(table)}
          WHERE key = ?
        `;
      } else {
        query = `
          UPDATE ${this._sanitizeIdentifier(table)}
          SET value = json_remove(value, ?)
          WHERE key = ?
        `;
      }

      logger.info(
        `Executing query: ${query} with params: [${
          jsonPath === null ? key : `$.${jsonPath}`
        }, ${key}]`
      );
      const stmt = db.prepare(query);
      stmt.run(jsonPath === null ? key : `$.${jsonPath}`, key);
    } catch (error) {
      logger.error(
        `Error deleting data in table '${table}' with path '${path}':`,
        error
      );
    }
  }

  deleteTable(table) {
    const db = this._getDBInstance();
    try {
      const query = `DROP TABLE IF EXISTS ${this._sanitizeIdentifier(table)}`;
      logger.info(`Executing query: ${query}`);
      db.exec(query);
    } catch (error) {
      logger.error(`Error deleting table '${table}':`, error);
    }
  }

  _splitPath(path) {
    if (!path || typeof path !== "string") {
      logger.error("Invalid path format. Path must be a non-empty string.");
      throw new Error(
        "Invalid path format. Path must be a non-empty string in the format 'key.jsonPath'."
      );
    }

    const [key, ...rest] = path.split(".");

    if (!key) {
      logger.error("Path must contain a valid key.");
      throw new Error("Invalid path format. Path must include a key.");
    }

    if (rest.length === 0) {
      logger.info(
        `No JSON path specified, inserting value directly into key: '${key}'`
      );
      return [key, null];
    }

    const jsonPath = rest.join(".");
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
      logger.info("Database connection closed.");
    }
  }
}

module.exports = DB;
