import type { UiRuntime } from "@job-buddy/ui";

/**
 * 浏览器宿主的运行时适配。
 *
 * 浏览器没有窗口 chrome（标题栏整行不渲染），也没有本地目录访问权限，
 * 因此只提供应用信息：窗口能力与项目能力缺省，UI 按“无宿主 chrome”处理。
 */
export function createWebRuntime(): UiRuntime {
  return {
    getAppInfo: async () => ({
      name: "JobBuddy",
      version: __APP_VERSION__,
      platform: "web",
    }),
  };
}
