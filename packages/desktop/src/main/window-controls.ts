import { BrowserWindow, ipcMain, type IpcMainInvokeEvent } from "electron";
import type { WindowState } from "@job-buddy/client";

import { readWindowChrome, subscribeWindowChrome } from "./window-chrome.js";
import {
  WINDOW_CLOSE_CHANNEL,
  WINDOW_DEVTOOLS_AVAILABLE_CHANNEL,
  WINDOW_MINIMIZE_CHANNEL,
  WINDOW_RELOAD_CHANNEL,
  WINDOW_RESET_ZOOM_CHANNEL,
  WINDOW_STATE_CHANGED_CHANNEL,
  WINDOW_STATE_CHANNEL,
  WINDOW_TOGGLE_MAXIMIZE_CHANNEL,
  WINDOW_TOGGLE_DEVTOOLS_CHANNEL,
  WINDOW_ZOOM_IN_CHANNEL,
  WINDOW_ZOOM_OUT_CHANNEL,
} from "../shared/ipc.js";

function getWindow(event: IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window || window.isDestroyed() || event.senderFrame !== event.sender.mainFrame) {
    throw new Error("Window controls require the owning window's main frame");
  }
  return window;
}

function getState(window: BrowserWindow): WindowState {
  return { maximized: window.isMaximized(), chrome: readWindowChrome(window) };
}

/** Push a fresh snapshot; zoom and fullscreen also change the chrome metrics. */
function publishState(window: BrowserWindow): void {
  if (!window.webContents.isDestroyed()) {
    window.webContents.send(WINDOW_STATE_CHANGED_CHANNEL, getState(window));
  }
}

/** Zoom stays in Electron; menu clicks and shortcuts share the same 50–300% limits. */
function changeZoom(window: BrowserWindow, direction: -1 | 1): void {
  const minimum = Math.log(0.5) / Math.log(1.2);
  const maximum = Math.log(3) / Math.log(1.2);
  const contents = window.webContents;
  contents.setZoomLevel(Math.max(minimum, Math.min(maximum, contents.getZoomLevel() + direction)));
  publishState(window);
}

/** Resolve the caller's window rather than accepting renderer-supplied window IDs. */
export function registerWindowControlHandlers({ allowDevTools }: { allowDevTools: boolean }): void {
  ipcMain.handle(WINDOW_STATE_CHANNEL, (event) => getState(getWindow(event)));
  ipcMain.handle(WINDOW_DEVTOOLS_AVAILABLE_CHANNEL, () => allowDevTools);
  ipcMain.handle(WINDOW_MINIMIZE_CHANNEL, (event) => getWindow(event).minimize());
  ipcMain.handle(WINDOW_TOGGLE_MAXIMIZE_CHANNEL, (event) => {
    const window = getWindow(event);
    if (window.isMaximized()) window.unmaximize();
    else window.maximize();
  });
  ipcMain.handle(WINDOW_TOGGLE_DEVTOOLS_CHANNEL, (event) => {
    if (!allowDevTools) return;
    getWindow(event).webContents.toggleDevTools();
  });
  ipcMain.handle(WINDOW_RELOAD_CHANNEL, (event) => getWindow(event).webContents.reload());
  ipcMain.handle(WINDOW_ZOOM_IN_CHANNEL, (event) => changeZoom(getWindow(event), 1));
  ipcMain.handle(WINDOW_ZOOM_OUT_CHANNEL, (event) => changeZoom(getWindow(event), -1));
  ipcMain.handle(WINDOW_RESET_ZOOM_CHANNEL, (event) => {
    const window = getWindow(event);
    window.webContents.setZoomLevel(0);
    publishState(window);
  });
  ipcMain.handle(WINDOW_CLOSE_CHANNEL, (event) => getWindow(event).close());
}

/** Keep the custom title bar shortcuts available after removing Electron's native menu. */
export function registerWindowShortcuts(window: BrowserWindow, { allowDevTools }: { allowDevTools: boolean }): void {
  const contents = window.webContents;
  const listener = (event: Electron.Event, input: Electron.Input) => {
    if (input.type !== "keyDown" || input.isComposing || (!input.control && !input.meta) || input.alt) return;

    const key = input.key.toLowerCase();
    if (key === "r" && !input.shift) {
      event.preventDefault();
      if (!input.isAutoRepeat) contents.reload();
    } else if (key === "i" && input.shift && allowDevTools) {
      event.preventDefault();
      if (!input.isAutoRepeat) contents.toggleDevTools();
    } else if (key === "=" || key === "+") {
      event.preventDefault();
      changeZoom(window, 1);
    } else if (key === "-" && !input.shift) {
      event.preventDefault();
      changeZoom(window, -1);
    } else if (key === "0" && !input.shift) {
      event.preventDefault();
      contents.setZoomLevel(0);
      publishState(window);
    }
  };

  contents.on("before-input-event", listener);
  window.once("closed", () => contents.removeListener("before-input-event", listener));
}

/** Native maximize/restore, zoom and fullscreen all republish the window snapshot. */
export function observeWindowState(window: BrowserWindow): void {
  const publish = () => publishState(window);
  window.on("maximize", publish);
  window.on("unmaximize", publish);
  const unsubscribeChrome = subscribeWindowChrome(window, publish);
  window.once("closed", () => {
    window.removeListener("maximize", publish);
    window.removeListener("unmaximize", publish);
    unsubscribeChrome();
  });
}
