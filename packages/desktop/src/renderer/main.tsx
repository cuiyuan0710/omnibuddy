import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "@omnibuddy/ui";
import type { UiRuntime } from "@omnibuddy/contracts";
import "@omnibuddy/ui/styles.css";

const runtime: UiRuntime = {
  appName: window.omniBuddy.appName,
  getAppInfo: () => window.omniBuddy.getAppInfo(),
  windowControls: window.omniBuddy.windowControls,
  platform: window.omniBuddy.platform,
  projects: window.omniBuddy.projects,
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <Root runtime={runtime} />
  </StrictMode>,
);
