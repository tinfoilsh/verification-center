const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const outDir = "out";

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;

    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(walk(full, rel));
    } else {
      files.push(rel.replace(/\\/g, "/"));
    }
  }

  return files;
}

function sha256Base64Url(fullPath) {
  const data = fs.readFileSync(fullPath); // raw bytes
  const base64 = crypto.createHash("sha256").update(data).digest("base64");
  return base64
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

const files = walk(outDir).sort();

const manifest = {};

for (const rel of files) {
  const full = path.join(outDir, rel);

  let normalized = "/" + rel.replace(/\\/g, "/");

  if (normalized.endsWith(".html")) {
    normalized = normalized.slice(0, -5);
  }

  manifest[normalized] = sha256Base64Url(full);
}

fs.writeFileSync(
  path.join(outDir, "file-list.json"),
  JSON.stringify(manifest, null, 2) + "\n"
);

console.log("Generated list with", files.length, "files");