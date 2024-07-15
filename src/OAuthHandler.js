const { BrowserWindow, shell } = require("electron");
const { EventEmitter } = require("events");
const url = require("url");
const LoopbackRedirectServer = require("./LoopBackRedirectServer");

const BW =
  process.type === "renderer"
    ? require("@electron/remote").BrowserWindow
    : BrowserWindow;

class OAuth2Handler extends EventEmitter {
  async openAuthWindowAndGetAuthorizationCode(authUrl, redirectUrl) {
    const parsedRedirectUrl = new URL(redirectUrl);

    if (this.server) {
      await this.server.close();
      this.server = null;
    }
    this.server = new LoopbackRedirectServer({
      origin: parsedRedirectUrl.origin,
      callbackPort: parsedRedirectUrl.port,
      callbackPathName: parsedRedirectUrl.pathname,
    });

    shell.openExternal(authUrl);

    const callbackURL = await this.server.waitForRedirection();
    this.server = null;

    const parsed = url.parse(callbackURL, true);
    if (parsed.query.error) {
      throw new Error(parsed.query.error_description);
    } else if (!parsed.query.code) {
      throw new Error("Unknown");
    }

    BW.getAllWindows()
      .filter((w) => w.isVisible())
      .forEach((w) => w.show());

    return parsed.query.code;
  }
}

module.exports = OAuth2Handler;
