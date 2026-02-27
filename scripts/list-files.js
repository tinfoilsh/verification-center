const fs = require("fs");
const path = require("path");

const outDir = "out";

function walk(dir, base = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files = [];

  for (const entry of entries) {
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

const files = walk(outDir).sort();

fs.writeFileSync(
  path.join(outDir, "file-list.json"),
  JSON.stringify(files, null, 2)
);

console.log("Generated file list with", files.length, "files");