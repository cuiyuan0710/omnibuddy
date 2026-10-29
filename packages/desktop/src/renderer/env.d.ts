import type { AppInfo, HostPlatform, ProjectControls, WindowControls } from "@omnibuddy/contracts";

declare global {
  interface Window {
    omniBuddy: {
      appName: string;
      platform: HostPlatform;
      getAppInfo(): Promise<AppInfo>;
      windowControls: WindowControls;
      projects: ProjectControls;
    };
  }
}

export {};
