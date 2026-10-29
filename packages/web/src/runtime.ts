import type { UiRuntime } from "@omnibuddy/contracts";
import { appConfig } from "../../../app.config.js";

/**
 * 浏览器宿主的运行时适配。
 *
 * 浏览器没有窗口 chrome（标题栏整行不渲染），也没有本地目录访问权限，
 * 因此只提供应用信息：窗口能力与项目能力缺省，UI 按“无宿主 chrome”处理。
 */
export function createWebRuntime(): UiRuntime {
  return {
    appName: appConfig.displayName,
    getAppInfo: async () => ({
      name: appConfig.displayName,
      version: __APP_VERSION__,
      platform: "web",
    }),
  };
}
