import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root, type UiRuntime } from "@job-buddy/ui";
import "@job-buddy/ui/styles.css";

const runtime: UiRuntime = {
  getAppInfo: () => window.jobBuddy.getAppInfo(),
  windowControls: window.jobBuddy.windowControls,
  platform: window.jobBuddy.platform,
  projects: window.jobBuddy.projects,
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
