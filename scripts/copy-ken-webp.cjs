#!/usr/bin/env node
/**
 * Copies src/images/ken.webp to public/ken.webp so that:
 * - The preload and og:image/twitter:image relative path /ken.webp resolves
 * - LHCI and crawlers get a stable URL without build hashes
 */
const fs = require("fs");
const path = require("path");

const src = path.join(__dirname, "..", "src", "images", "ken.webp");
const dest = path.join(__dirname, "..", "public", "ken.webp");

if (!fs.existsSync(src)) {
  console.warn("copy-ken-webp: src/images/ken.webp not found, skipping");
  process.exit(0);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.copyFileSync(src, dest);
console.log("copy-ken-webp: public/ken.webp updated");
