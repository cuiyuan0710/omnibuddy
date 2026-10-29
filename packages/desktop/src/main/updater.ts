import { app, BrowserWindow, ipcMain, type IpcMainInvokeEvent } from "electron";
import { autoUpdater } from "electron-updater";
import type { NsisUpdater } from "electron-updater";
import type { AppUpdateState } from "@omnibuddy/contracts";
import {
  UPDATE_CHECK_CHANNEL,
  UPDATE_DOWNLOAD_CHANNEL,
  UPDATE_INSTALL_CHANNEL,
  UPDATE_STATE_CHANNEL,
  UPDATE_STATE_CHANGED_CHANNEL,
} from "../shared/ipc.js";

const supportedPlatform = process.platform === "win32"
  || (process.platform === "linux" && Boolean(process.env.APPIMAGE));

export function isAppUpdateSupported(): boolean {
  return app.isPackaged && supportedPlatform;
}

let state: AppUpdateState = {
  phase: supportedPlatform ? "idle" : "unsupported",
  currentVersion: app.getVersion(),
};
let handlersRegistered = false;

function publish(patch: Partial<AppUpdateState>): void {
  state = { ...state, ...patch };
  for (const window of BrowserWindow.getAllWindows()) {
    if (!window.isDestroyed() && !window.webContents.isDestroyed()) {
      window.webContents.send(UPDATE_STATE_CHANGED_CHANNEL, state);
    }
  }
}

function validateSender(event: IpcMainInvokeEvent): void {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window || window.isDestroyed() || event.senderFrame !== event.sender.mainFrame) {
    throw new Error("Update controls require the owning window's main frame");
  }
}

async function checkForUpdates(): Promise<void> {
  if (!isAppUpdateSupported()) return;
  publish({ phase: "checking", error: undefined, percent: undefined });
  try {
    await autoUpdater.checkForUpdates();
  } catch (error) {
    publish({ phase: "error", error: error instanceof Error ? error.message : String(error) });
  }
}

export function registerUpdateHandlers(): void {
  if (handlersRegistered) return;
  handlersRegistered = true;

  if (isAppUpdateSupported()) {
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = false;
    autoUpdater.allowDowngrade = false;
    if (process.platform === "win32") {
      (autoUpdater as NsisUpdater).verifyUpdateCodeSignature = async () => null;
    }
    autoUpdater.on("checking-for-update", () => publish({ phase: "checking", error: undefined }));
    autoUpdater.on("update-available", (info) => publish({
      phase: "available",
      availableVersion: info.version,
      percent: undefined,
      error: undefined,
    }));
    autoUpdater.on("update-not-available", () => publish({
      phase: "not-available",
      availableVersion: undefined,
      percent: undefined,
      error: undefined,
    }));
    autoUpdater.on("download-progress", (progress) => publish({
      phase: "downloading",
      percent: Math.max(0, Math.min(100, Math.round(progress.percent))),
    }));
    autoUpdater.on("update-downloaded", (info) => publish({
      phase: "downloaded",
      availableVersion: info.version,
      percent: 100,
      error: undefined,
    }));
    autoUpdater.on("error", (error) => publish({ phase: "error", error: error.message }));
  }

  ipcMain.handle(UPDATE_STATE_CHANNEL, (event) => {
    validateSender(event);
    return state;
  });
  ipcMain.handle(UPDATE_CHECK_CHANNEL, (event) => {
    validateSender(event);
    return checkForUpdates();
  });
  ipcMain.handle(UPDATE_DOWNLOAD_CHANNEL, async (event) => {
    validateSender(event);
    if (!isAppUpdateSupported() || state.phase !== "available") return;
    publish({ phase: "downloading", percent: 0, error: undefined });
    try {
      await autoUpdater.downloadUpdate();
    } catch (error) {
      publish({ phase: "error", error: error instanceof Error ? error.message : String(error) });
    }
  });
  ipcMain.handle(UPDATE_INSTALL_CHANNEL, (event) => {
    validateSender(event);
    if (isAppUpdateSupported() && state.phase === "downloaded") {
      autoUpdater.quitAndInstall(false, true);
    }
  });
}

export function startUpdateChecks(): void {
  if (isAppUpdateSupported()) {
    setTimeout(() => void checkForUpdates(), 4000).unref();
  }
}
