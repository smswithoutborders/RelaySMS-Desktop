const { app } = require("electron");
const fs = require("fs");
const path = require("path");

const logFilePath = path.join(app.getPath("logs"), "app.log");

const maxLogSize = 5 * 1024 * 1024;

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
    const formattedArgs = args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
    );
    const message = `[${timestamp}] [INFO] ${formattedArgs.join(" ")}\n`;
    logFile.write(message);
    originalLog(...formattedArgs);
  },
  warn: (...args) => {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
    );
    const message = `[${timestamp}] [WARN] ${formattedArgs.join(" ")}\n`;
    logFile.write(message);
    originalLog(...formattedArgs);
  },
  error: (...args) => {
    const timestamp = new Date().toISOString();
    const formattedArgs = args.map((arg) =>
      typeof arg === "object" ? JSON.stringify(arg, null, 2) : arg
    );
    const message = `[${timestamp}] [ERROR] ${formattedArgs.join(" ")}\n`;
    logFile.write(message);
    originalError(...formattedArgs);
  },
};

module.exports = logger;
