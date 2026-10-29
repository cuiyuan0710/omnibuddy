import type { HostPlatform, WindowChrome } from "./window-chrome.js";

export {
  resolveTrafficLightPosition,
  resolveWindowChrome,
  type WindowChrome,
} from "./window-chrome.js";
export type { HostPlatform } from "./window-chrome.js";
export { windowChromeConfig } from "./window-chrome.config.js";
/** Desktop persists user-selected project directories and display names. */
export interface WorkspaceProject { id: string; name: string; path: string }
export interface ProjectControls {
  list(): Promise<WorkspaceProject[]>;
  choose(): Promise<WorkspaceProject | null>;
  rename(projectId: string, name: string): Promise<void>;
  remove(projectId: string): Promise<void>;
}
/** Desktop's BrowserWindow owns this state; UI only keeps a display snapshot. */
export interface WindowState {
  maximized: boolean;
  /** 宿主绘制的窗口控件占位；随缩放与全屏变化，由 Desktop 推送。 */
  chrome: WindowChrome;
}

/** Narrow capabilities for the custom title bar, implemented by Desktop IPC. */
export interface WindowControls {
  getState(): Promise<WindowState>;
  canOpenDevTools(): Promise<boolean>;
  minimize(): Promise<void>;
  toggleMaximize(): Promise<void>;
  toggleDevTools(): Promise<void>;
  reload(): Promise<void>;
  zoomIn(): Promise<void>;
  zoomOut(): Promise<void>;
  resetZoom(): Promise<void>;
  close(): Promise<void>;
  subscribe(handler: (state: WindowState) => void): () => void;
}

export interface AppInfo { name: string; version: string; platform: string }

/** Host operations exposed to the renderer through its host adapter. */
export interface UiRuntime {
  /** Configurable user-visible application name, independent of package IDs. */
  appName: string;
  getAppInfo(): Promise<AppInfo>;
  /** Missing window controls means the host does not render a title bar. */
  windowControls?: WindowControls;
  /** Missing platform means the host is a browser. */
  platform?: HostPlatform;
  /** Local project-directory operations are available only in Desktop. */
  projects?: ProjectControls;
}
