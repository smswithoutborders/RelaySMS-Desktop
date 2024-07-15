const http = require("http");
const url = require("url");

class LoopbackRedirectServer {
  constructor({ origin, callbackPort, callbackPathName }) {
    this._maybeRedirection = new Promise((resolve, reject) => {
      this._server = http.createServer((req, res) => {
        if (req.url && url.parse(req.url).pathname === callbackPathName) {
          res.writeHead(302, {
            Location: "https://relay.smswithoutborders.com",
          });
          res.end();

          resolve(url.resolve(origin, req.url));

          this._server.close();
        } else {
          res.writeHead(404);
          res.end();
        }
      });
      this._server.on("error", (e) => reject(e));
      this._server.listen(callbackPort);
    });
  }

  waitForRedirection() {
    return this._maybeRedirection;
  }

  close() {
    return new Promise((resolve) => this._server.close(resolve));
  }
}

module.exports = LoopbackRedirectServer;