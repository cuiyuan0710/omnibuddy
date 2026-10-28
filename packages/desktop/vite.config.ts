import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./src/renderer/", import.meta.url)),
  base: "./",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../ui/src/", import.meta.url)),
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    outDir: fileURLToPath(new URL("./dist/renderer/", import.meta.url)),
    emptyOutDir: true,
  },
});
