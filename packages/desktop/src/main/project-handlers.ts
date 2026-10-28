import { BrowserWindow, dialog, ipcMain } from "electron";
import type { IpcMainInvokeEvent } from "electron";
import { ProjectDirectories } from "./project-directories";
import {
  PROJECT_CHOOSE_CHANNEL, PROJECT_LIST_CHANNEL,
  PROJECT_REMOVE_CHANNEL, PROJECT_RENAME_CHANNEL,
} from "../shared/ipc";

function owningWindow(event: IpcMainInvokeEvent): BrowserWindow {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (!window || window.isDestroyed() || event.senderFrame !== event.sender.mainFrame) {
    throw new Error("Navigation requires the owning window's main frame");
  }
  return window;
}

function requiredString(value: unknown): string {
  if (typeof value !== "string" || !value.trim()) throw new Error("参数不能为空");
  return value;
}

/** Whitelisted project-directory IPC owned by the Desktop host. */
export function registerProjectHandlers(projectFilePath: string): void {
  const projects = new ProjectDirectories(projectFilePath);
  ipcMain.handle(PROJECT_LIST_CHANNEL, (event) => { owningWindow(event); return projects.list(); });
  ipcMain.handle(PROJECT_CHOOSE_CHANNEL, async (event) => {
    const window = owningWindow(event);
    const result = await dialog.showOpenDialog(window, { title: "添加项目", properties: ["openDirectory"] });
    return result.canceled || !result.filePaths[0] ? null : projects.add(result.filePaths[0]);
  });
  ipcMain.handle(PROJECT_RENAME_CHANNEL, (event, id: unknown, name: unknown) => {
    owningWindow(event);
    return projects.rename(requiredString(id), requiredString(name));
  });
  ipcMain.handle(PROJECT_REMOVE_CHANNEL, (event, id: unknown) => {
    owningWindow(event);
    return projects.remove(requiredString(id));
  });
}
