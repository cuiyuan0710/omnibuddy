import type { HostPlatform, ProjectControls, WindowControls } from "@job-buddy/client";

export interface AppInfo { name: string; version: string; platform: string }
/** Host operations exposed to the renderer through the Desktop preload. */
export interface UiRuntime {
  getAppInfo(): Promise<AppInfo>;
  /**
   * 窗口能力。缺省表示宿主没有窗口 chrome（浏览器构建），标题栏整行不渲染。
   */
  windowControls?: WindowControls;
  /** 宿主平台。缺省表示浏览器。 */
  platform?: HostPlatform;
  /** 本地项目目录能力。Desktop 专有；浏览器没有目录访问权限，缺省。 */
  projects?: ProjectControls;
}
