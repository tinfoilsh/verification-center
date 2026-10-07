#!/usr/bin/env node
// Serves the static export (out/) the way the deployment does: clean URLs,
// 404.html fallback, and the exact CSP from webcat/webcat.config.json on
// every response. Playwright runs the suite against this so the tests
// exercise the shipped HTML under the shipped policy.
const fs = require("fs");
const http = require("http");
const path = require("path");

const port = Number(process.argv[2] || 3003);
const root = path.join(__dirname, "..", "out");
const csp = require("../webcat/webcat.config.json").default_csp;

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".txt": "text/plain",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (p.endsWith("/")) p += "index.html";
    let file = path.join(root, p);
    if (!file.startsWith(root)) file = path.join(root, "404.html");
    if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
    let status = 200;
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(root, "404.html");
      status = 404;
    }
    res.writeHead(status, {
      "Content-Type": types[path.extname(file)] || "application/octet-stream",
      "Content-Security-Policy": csp,
    });
    fs.createReadStream(file).pipe(res);
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`serving ${root} on http://127.0.0.1:${port} with CSP: ${csp}`);
  });
