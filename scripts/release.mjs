#!/usr/bin/env node
/**
 * Otomatik sürümleme:
 *   bun run release -- patch "Başlık" "not 1" "not 2"
 *   bun run release -- minor "Yeni panel" "..."
 * Yaptıkları:
 *  1) src/lib/fit/version.ts içindeki CHANGELOG'un en üstüne yeni kayıt ekler
 *  2) package.json "version" alanını günceller
 *  3) CHANGELOG.md dosyasını yeniden üretir
 */
import { readFileSync, writeFileSync } from "node:fs";

const VERSION_FILE = "src/lib/fit/version.ts";
const MARKER = "// <!-- release:next -->";

const args = process.argv.slice(2);
const type = ["major", "minor", "patch"].includes(args[0]) ? args.shift() : "patch";
const title = args.shift() || "Bakım güncellemesi";
const notes = args.length ? args : ["Küçük iyileştirmeler ve hata düzeltmeleri"];

const src = readFileSync(VERSION_FILE, "utf8");
const current = src.match(/version:\s*"(\d+)\.(\d+)\.(\d+)"/);
if (!current) throw new Error("Mevcut sürüm bulunamadı: " + VERSION_FILE);
let [major, minor, patch] = current.slice(1).map(Number);
if (type === "major") { major += 1; minor = 0; patch = 0; }
else if (type === "minor") { minor += 1; patch = 0; }
else patch += 1;
const version = `${major}.${minor}.${patch}`;
const date = new Date().toISOString().slice(0, 10);

const entry = [
  "  {",
  `    version: "${version}",`,
  `    date: "${date}",`,
  `    type: "${type}",`,
  `    title: ${JSON.stringify(title)},`,
  "    notes: [",
  ...notes.map((n) => `      ${JSON.stringify(n)},`),
  "    ],",
  "  },",
].join("\n");

if (!src.includes(MARKER)) throw new Error(`${MARKER} işareti ${VERSION_FILE} içinde yok`);
const next = src.replace(MARKER, `${MARKER}\n${entry}`);
writeFileSync(VERSION_FILE, next);

// package.json sürümü
const pkgPath = "package.json";
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
pkg.version = version;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

// CHANGELOG.md
const releases = [...next.matchAll(/\{\s*version: "([^"]+)",\s*date: "([^"]+)",\s*type: "([^"]+)",\s*title: "([^"]+)",\s*notes: \[([\s\S]*?)\],\s*\},/g)];
const md = ["# Pro Fitness — Değişiklik Notları", ""];
for (const [, v, d, t, ttl, block] of releases) {
  md.push(`## v${v} — ${ttl}`, `_${d} • ${t}_`, "");
  for (const m of block.matchAll(/"((?:[^"\\]|\\.)*)"/g)) md.push(`- ${JSON.parse(`"${m[1]}"`)}`);
  md.push("");
}
writeFileSync("CHANGELOG.md", md.join("\n"));

console.log(`v${version} (${type}) eklendi → ${VERSION_FILE}, package.json, CHANGELOG.md`);
