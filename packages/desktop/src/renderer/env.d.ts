import type { AppInfo, AppUpdater, HostPlatform, ProjectControls, WindowControls } from "@omnibuddy/contracts";

declare global {
  interface Window {
    omniBuddy: {
      appName: string;
      platform: HostPlatform;
      getAppInfo(): Promise<AppInfo>;
      updater: AppUpdater;
      windowControls: WindowControls;
      projects: ProjectControls;
    };
  }
}

export {};
