const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const outDir = "out";

function walk(dir) {
  const out = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function sha256Base64(str) {
  return crypto
    .createHash("sha256")
    .update(Buffer.from(str, "utf8"))
    .digest("base64");
}

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;

function main() {
  if (!fs.existsSync(outDir)) {
    throw new Error("Missing out/ directory. Run next build first.");
  }

  const htmlFiles = walk(outDir).filter((f) =>
    f.toLowerCase().endsWith(".html")
  );

  const result = {};

  for (const file of htmlFiles) {
    const html = fs.readFileSync(file, "utf8");

    scriptRegex.lastIndex = 0;

    let match;
    const hashes = [];

    while ((match = scriptRegex.exec(html)) !== null) {
      const attrs = match[1] || "";
      const content = match[2] || "";

      if (attrs.toLowerCase().includes("src=")) continue;
      if (content.trim().length === 0) continue;

      const hash = sha256Base64(content);
      hashes.push(`sha256-${hash}`);
    }

    if (hashes.length > 0) {
      const rel = path.relative(outDir, file).replace(/\\/g, "/");
      result[rel] = hashes;
    }
  }

  fs.writeFileSync(
    path.join(outDir, "inline-scripts.json"),
    JSON.stringify(result, null, 2) + "\n",
    "utf8"
  );

  console.log(`Generated CSP hashes file`);
}

main();