import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

const srcRoot = resolve(__dirname, "src");
const distRoot = resolve(__dirname, "dist");

export default defineConfig({
  plugins: [
    react(),
    dts({
      beforeWriteFile(filePath, content) {
        const distSrcRoot = `${distRoot}/src/`;

        if (filePath.startsWith(distSrcRoot)) {
          return {
            filePath: `${distRoot}/${filePath.slice(distSrcRoot.length)}`,
            content,
          };
        }

        return { filePath, content };
      },
      entryRoot: srcRoot,
      exclude: ["src/**/*.stories.ts", "src/**/*.stories.tsx", "src/**/*.test.ts", "src/**/*.test.tsx"],
      include: ["src"],
      outDirs: distRoot,
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        primitives: resolve(__dirname, "src/primitives.ts"),
        patterns: resolve(__dirname, "src/patterns.ts"),
        types: resolve(__dirname, "src/types.ts"),
        headless: resolve(__dirname, "src/headless.ts"),
      },
      formats: ["es"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime"],
      output: {
        assetFileNames: "assets/[name][extname]",
        entryFileNames: "[name].js",
      },
    },
  },
});
