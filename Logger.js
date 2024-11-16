const { app } = require("electron");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(app.getPath("logs"), "app.log");

const maxLogSize = 5 * 1024 * 1024; // 5 MB

const rotateLogs = () => {
  if (
    fs.existsSync(logFilePath) &&
    fs.statSync(logFilePath).size >= maxLogSize
  ) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const archivePath = logFilePath.replace(".log", `-${timestamp}.log`);
    fs.renameSync(logFilePath, archivePath);
  }
};

rotateLogs();

const logFile = fs.createWriteStream(logFilePath, { flags: "a" });

const originalLog = console.log;
const originalError = console.error;

const logger = {
  info: (...args) => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] [INFO] ${args.join(" ")}\n`;
    logFile.write(message);
    originalLog(...args);
  },
  warn: (...args) => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] [WARN] ${args.join(" ")}\n`;
    logFile.write(message);
    originalLog(...args);
  },
  error: (...args) => {
    const timestamp = new Date().toISOString();
    const message = `[${timestamp}] [ERROR] ${args.join(" ")}\n`;
    logFile.write(message);
    originalError(...args);
  },
};

module.exports = logger;
