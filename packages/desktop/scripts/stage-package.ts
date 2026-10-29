import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { appConfig } from "../../../app.config.js";

const desktopRoot = join(import.meta.dir, "..");
const distDir = join(desktopRoot, "dist");
const appDir = join(desktopRoot, "release", "app");
const iconPath = join(desktopRoot, "assets", "job-buddy-logo.png");
const icnsPath = join(desktopRoot, "assets", "omnibuddy.icns");

const png = readFileSync(iconPath);
if (png.toString("hex", 0, 8) !== "89504e470d0a1a0a") {
  throw new Error(`Not a PNG file: ${iconPath}`);
}
if (png.readUInt32BE(16) !== 256 || png.readUInt32BE(20) !== 256) {
  throw new Error("The macOS icon source must be 256 × 256 pixels.");
}

// ICNS ic08 embeds the source PNG directly at its native 256 × 256 size.
const icnsChunk = Buffer.alloc(8 + png.length);
icnsChunk.write("ic08", 0, "ascii");
icnsChunk.writeUInt32BE(icnsChunk.length, 4);
png.copy(icnsChunk, 8);
const icns = Buffer.alloc(8 + icnsChunk.length);
icns.write("icns", 0, "ascii");
icns.writeUInt32BE(icns.length, 4);
icnsChunk.copy(icns, 8);
writeFileSync(icnsPath, icns);

rmSync(appDir, { recursive: true, force: true });
mkdirSync(appDir, { recursive: true });
cpSync(distDir, join(appDir, "dist"), { recursive: true });
writeFileSync(
  join(appDir, "package.json"),
  `${JSON.stringify(
    {
      name: "omnibuddy",
      productName: appConfig.displayName,
      version: appConfig.version,
      description: "OmniBuddy desktop application",
      homepage: appConfig.homepage,
      author: appConfig.maintainer,
      private: true,
      type: "commonjs",
      main: "dist/main/index.cjs",
    },
    null,
    2,
  )}\n`,
);

console.log(`Staged ${appConfig.displayName} ${appConfig.version} for Electron packaging.`);
