import { appConfig } from "../../app.config.ts";
import electronPackage from "./node_modules/electron/package.json" with { type: "json" };
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const desktopRoot = dirname(fileURLToPath(import.meta.url));

/** Electron packaging metadata is generated from the root product config. */
export default {
  appId: appConfig.appId,
  productName: appConfig.displayName,
  electronVersion: electronPackage.version,
  extraMetadata: {
    version: appConfig.version,
  },
  directories: {
    app: resolve(desktopRoot, "release", "app"),
    output: resolve(desktopRoot, "release", "out"),
    buildResources: resolve(desktopRoot, "assets"),
  },
  // Main, preload and renderer are bundled at build time; shipping workspace
  // node_modules would duplicate the entire UI dependency graph in app.asar.
  files: ["dist/**/*", "package.json", "!node_modules/**/*"],
  asar: true,
  npmRebuild: false,
  publish: [
    {
      provider: "github",
      owner: appConfig.github.owner,
      repo: appConfig.github.repo,
      releaseType: "release",
    },
  ],
  win: {
    icon: resolve(desktopRoot, "assets", "job-buddy.ico"),
    target: [{ target: "nsis", arch: ["x64"] }],
    artifactName: "${productName}-${version}-win-${arch}.${ext}",
    verifyUpdateCodeSignature: false,
  },
  nsis: {
    oneClick: false,
    perMachine: false,
    allowElevation: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
  },
  mac: {
    icon: resolve(desktopRoot, "assets", "omnibuddy.icns"),
    target: [
      { target: "dmg", arch: ["arm64", "x64"] },
      { target: "zip", arch: ["arm64", "x64"] },
    ],
    category: "public.app-category.productivity",
    identity: null,
    hardenedRuntime: false,
    notarize: false,
    artifactName: "${productName}-${version}-mac-${arch}.${ext}",
  },
  dmg: {
    contents: [
      { x: 130, y: 220 },
      { x: 410, y: 220, type: "link", path: "/Applications" },
    ],
  },
  linux: {
    icon: resolve(desktopRoot, "assets", "job-buddy-logo.png"),
    executableName: "omnibuddy",
    maintainer: `${appConfig.maintainer.name} <${appConfig.maintainer.email}>`,
    category: "Development",
    synopsis: "OmniBuddy desktop app",
    description: "OmniBuddy desktop application.",
    target: [
      { target: "AppImage", arch: ["x64"] },
      { target: "deb", arch: ["x64"] },
    ],
    artifactName: "${productName}-${version}-linux-${arch}.${ext}",
  },
  deb: {
    packageName: "omnibuddy",
  },
};
