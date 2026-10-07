import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import dts from "vite-plugin-dts";
import vitePluginSvgr from "vite-plugin-svgr";

const configDirectory = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    vitePluginSvgr({
      include: "**/*.svg?react",
    }),
    dts({
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    lib: {
      entry: resolve(configDirectory, "src/index.ts"),
      name: "AbstractFS",
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`,
      formats: ["es", "cjs"],
      cssFileName: "style",
    },
    cssCodeSplit: false,
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
      ],
    },
  },
});
