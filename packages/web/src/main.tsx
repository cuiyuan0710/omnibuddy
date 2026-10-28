import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Root } from "@job-buddy/ui";
import "@job-buddy/ui/styles.css";

import { createWebRuntime } from "./runtime";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Missing root element");
}

createRoot(rootElement).render(
  <StrictMode>
    <Root runtime={createWebRuntime()} />
  </StrictMode>,
);
