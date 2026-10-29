import { contextBridge, ipcRenderer } from "electron";
import type { AppInfo, AppUpdater, AppUpdateState, HostPlatform, WindowControls, WindowState } from "@omnibuddy/contracts";
import { appConfig } from "../../../../app.config.js";
import {
  APP_INFO_CHANNEL,
  WINDOW_STATE_CHANNEL, WINDOW_STATE_CHANGED_CHANNEL, WINDOW_MINIMIZE_CHANNEL,
  WINDOW_DEVTOOLS_AVAILABLE_CHANNEL, WINDOW_TOGGLE_MAXIMIZE_CHANNEL,
  WINDOW_TOGGLE_DEVTOOLS_CHANNEL, WINDOW_CLOSE_CHANNEL,
  WINDOW_RELOAD_CHANNEL, WINDOW_ZOOM_IN_CHANNEL, WINDOW_ZOOM_OUT_CHANNEL,
  WINDOW_RESET_ZOOM_CHANNEL,
  PROJECT_LIST_CHANNEL, PROJECT_CHOOSE_CHANNEL, PROJECT_RENAME_CHANNEL, PROJECT_REMOVE_CHANNEL,
  UPDATE_STATE_CHANNEL, UPDATE_CHECK_CHANNEL, UPDATE_DOWNLOAD_CHANNEL, UPDATE_INSTALL_CHANNEL, UPDATE_STATE_CHANGED_CHANNEL,
} from "../shared/ipc.js";

const windowControls: WindowControls = {
  getState: () => ipcRenderer.invoke(WINDOW_STATE_CHANNEL),
  canOpenDevTools: () => ipcRenderer.invoke(WINDOW_DEVTOOLS_AVAILABLE_CHANNEL),
  minimize: () => ipcRenderer.invoke(WINDOW_MINIMIZE_CHANNEL),
  toggleMaximize: () => ipcRenderer.invoke(WINDOW_TOGGLE_MAXIMIZE_CHANNEL),
  toggleDevTools: () => ipcRenderer.invoke(WINDOW_TOGGLE_DEVTOOLS_CHANNEL),
  reload: () => ipcRenderer.invoke(WINDOW_RELOAD_CHANNEL),
  zoomIn: () => ipcRenderer.invoke(WINDOW_ZOOM_IN_CHANNEL),
  zoomOut: () => ipcRenderer.invoke(WINDOW_ZOOM_OUT_CHANNEL),
  resetZoom: () => ipcRenderer.invoke(WINDOW_RESET_ZOOM_CHANNEL),
  close: () => ipcRenderer.invoke(WINDOW_CLOSE_CHANNEL),
  subscribe: (handler) => {
    const listener = (_event: Electron.IpcRendererEvent, state: WindowState) => handler(state);
    ipcRenderer.on(WINDOW_STATE_CHANGED_CHANNEL, listener);
    return () => { ipcRenderer.removeListener(WINDOW_STATE_CHANGED_CHANNEL, listener); };
  },
};
contextBridge.exposeInMainWorld("omniBuddy", {
  appName: appConfig.displayName,
  /** 同步平台标识，供 UI 首帧决定窗口 chrome 布局，避免异步查询造成跳动。 */
  platform: process.platform as HostPlatform,
  getAppInfo: (): Promise<AppInfo> => ipcRenderer.invoke(APP_INFO_CHANNEL), windowControls,
  updater: {
    getState: () => ipcRenderer.invoke(UPDATE_STATE_CHANNEL),
    checkForUpdates: () => ipcRenderer.invoke(UPDATE_CHECK_CHANNEL),
    downloadUpdate: () => ipcRenderer.invoke(UPDATE_DOWNLOAD_CHANNEL),
    installUpdate: () => ipcRenderer.invoke(UPDATE_INSTALL_CHANNEL),
    subscribe: (handler: (state: AppUpdateState) => void) => {
      const listener = (_event: Electron.IpcRendererEvent, state: AppUpdateState) => handler(state);
      ipcRenderer.on(UPDATE_STATE_CHANGED_CHANNEL, listener);
      return () => { ipcRenderer.removeListener(UPDATE_STATE_CHANGED_CHANNEL, listener); };
    },
  } satisfies AppUpdater,
  projects: {
    list: () => ipcRenderer.invoke(PROJECT_LIST_CHANNEL),
    choose: () => ipcRenderer.invoke(PROJECT_CHOOSE_CHANNEL),
    rename: (id: string, name: string) => ipcRenderer.invoke(PROJECT_RENAME_CHANNEL, id, name),
    remove: (id: string) => ipcRenderer.invoke(PROJECT_REMOVE_CHANNEL, id),
  },
});
