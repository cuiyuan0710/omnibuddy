import type { AppInfo } from "@job-buddy/ui";
import type { HostPlatform, ProjectControls, WindowControls } from "@job-buddy/client";

declare global {
  interface Window {
    jobBuddy: {
      platform: HostPlatform;
      getAppInfo(): Promise<AppInfo>;
      windowControls: WindowControls;
      projects: ProjectControls;
    };
  }
}

export {};
