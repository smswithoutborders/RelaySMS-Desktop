const { ipcMain } = require("electron");
const DB = require("../db");
const logger = require("../../Logger");

function setupDBHandlers() {
  const db = new DB("app_data.sqlite");

  ipcMain.handle("db-get-all", async (event, table, path) => {
    try {
      const result = db.getAll(table);
      return result;
    } catch (error) {
      logger.error("Error in db-get-all handler:", error.message);
      throw error;
    } finally {
      db.close();
    }
  });

  ipcMain.handle("db-get", async (event, table, path) => {
    try {
      const result = db.get(table, path);
      return result;
    } catch (error) {
      logger.error("Error in db-get handler:", error.message);
      throw error;
    } finally {
      db.close();
    }
  });

  ipcMain.handle("db-set", async (event, table, path, value) => {
    try {
      db.set(table, path, value);
      return { success: true };
    } catch (error) {
      logger.error("Error in db-set handler:", error.message);
      throw error;
    } finally {
      db.close();
    }
  });

  ipcMain.handle("db-delete", async (event, table, path) => {
    try {
      db.delete(table, path);
      return { success: true };
    } catch (error) {
      logger.error("Error in db-delete handler:", error.message);
      throw error;
    } finally {
      db.close();
    }
  });

  ipcMain.handle("db-delete-table", async (event, table) => {
    try {
      db.deleteTable(table);
      return { success: true };
    } catch (error) {
      logger.error("Error in db-delete-table handler:", error.message);
      throw error;
    } finally {
      db.close();
    }
  });
}

module.exports = { setupDBHandlers };
