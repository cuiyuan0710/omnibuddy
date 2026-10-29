import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import { appConfig } from "../../app.config.js";

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '\"': "&quot;",
  "'": "&#39;",
}[character]!));

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(appConfig.version),
  },
  root: fileURLToPath(new URL("./src/renderer/", import.meta.url)),
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../ui/src/", import.meta.url)),
    },
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
  build: {
    outDir: fileURLToPath(new URL("./dist/renderer/", import.meta.url)),
    emptyOutDir: true,
  },
});
