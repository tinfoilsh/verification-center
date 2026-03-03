#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: gen-csp-hashes <directory>");
  process.exit(1);
}

function walk(d) {
  return fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => {
    const full = path.join(d, e.name);
    return e.isDirectory() ? walk(full) : full;
  });
}

function hash(s) {
  return crypto.createHash("sha256").update(s, "utf8").digest("base64");
}

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
const hashes = new Set();

for (const file of walk(dir)) {
  if (!file.toLowerCase().endsWith(".html")) continue;

  const html = fs.readFileSync(file, "utf8");

  scriptRegex.lastIndex = 0;
  let m;

  while ((m = scriptRegex.exec(html))) {
    const attrs = m[1] || "";
    const content = (m[2] || "").trim();

    if (attrs.includes("src=")) continue;
    if (!content) continue;

    hashes.add(`'sha256-${hash(content)}'`);
  }
}

console.log([...hashes].join(" "));