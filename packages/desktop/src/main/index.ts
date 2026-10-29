import { app, BrowserWindow, ipcMain } from "electron";
import { dirname, join } from "node:path";
import { existsSync } from "node:fs";
import { rename } from "node:fs/promises";
import type { AppInfo } from "@omnibuddy/contracts";
import { homedir } from "node:os";
import { appConfig } from "../../../../app.config.js";
import { observeWindowState, registerWindowControlHandlers, registerWindowShortcuts } from "./window-controls";
import { resolveWindowChromeOptions } from "./window-chrome";
import { registerProjectHandlers } from "./project-handlers";
import { APP_INFO_CHANNEL } from "../shared/ipc.js";

/** Resolve assets in both the source checkout and a packaged Electron app. */
function resolveDesktopAsset(...segments: string[]): string {
  const candidates = [
    join(app.getAppPath(), ...segments),
    join(process.cwd(), "packages", "desktop", ...segments),
  ];
  return candidates.find((candidate) => existsSync(candidate)) ?? candidates[0];
}

/** 注册只读的应用信息请求，供渲染进程显示当前桌面宿主。 */
function registerAppInfoHandler(): void {
  ipcMain.handle(APP_INFO_CHANNEL, (): AppInfo => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
  }));
}

/** Move existing bookmarks to the renamed app folder on the user's first launch. */
async function resolveProjectDirectory(): Promise<string> {
  const home = homedir();
  const suffix = app.isPackaged ? "" : "-dev";
  const directory = join(home, `.omnibuddy${suffix}`);
  const legacyDirectory = join(home, `.job-buddy${suffix}`);

  if (!existsSync(directory) && existsSync(legacyDirectory)) {
    await rename(legacyDirectory, directory);
  }
  return directory;
}

// Keep the native app name in sync with the configurable display name.
app.setName(appConfig.displayName);

/** 创建隔离的桌面窗口，预加载脚本仅暴露允许的 IPC 方法。 */
function createMainWindow(): void {
  const window = new BrowserWindow({
    width: 1100,
    height: 720,
    minWidth: 720,
    minHeight: 500,
    ...resolveWindowChromeOptions(),
    webPreferences: {
      preload: resolveDesktopAsset("dist", "preload", "index.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      devTools: !app.isPackaged,
    },
  });

  window.setMenu(null);
  observeWindowState(window);
  registerWindowShortcuts(window, { allowDevTools: !app.isPackaged });
  void window.loadFile(resolveDesktopAsset("dist", "renderer", "index.html"));
}

void app.whenReady().then(() => {
  registerAppInfoHandler();
  return resolveProjectDirectory();
}).then((projectDirectory) => {
  registerProjectHandlers(join(projectDirectory, "projects.json"));
  registerWindowControlHandlers({ allowDevTools: !app.isPackaged });
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
}).catch((error: unknown) => {
  console.error("Unable to start desktop application:", error instanceof Error ? error.message : String(error));
  app.quit();
});


app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
