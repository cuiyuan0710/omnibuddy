import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { appConfig } from "../../app.config.js";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]!));

export default defineConfig({
  base: "./",
  define: {
    __APP_VERSION__: JSON.stringify(appConfig.version),
  },
  resolve: {
    // ui 包内部使用 `@/` 别名指向自己的源码。
    alias: {
      "@": fileURLToPath(new URL("../ui/src/", import.meta.url)),
    },
    // workspace 里 ui 包自带一份 react，避免两个实例导致 hooks 失效。
    dedupe: ["react", "react-dom"],
  },
  plugins: [
    {
      name: "omnibuddy-display-name",
      transformIndexHtml(html) {
        return html.replaceAll("%APP_DISPLAY_NAME%", escapeHtml(appConfig.displayName));
      },
    },
    react(),
    tailwindcss(),
  ],
  server: {
    port: 5173,
  },
});
