import type { WindowChrome } from "./window-chrome.js";

export {
  resolveTrafficLightPosition,
  resolveWindowChrome,
  type HostPlatform,
  type WindowChrome,
} from "./window-chrome.js";
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
