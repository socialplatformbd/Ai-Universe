import path from "path";
import { fileURLToPath } from "url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import fs from "fs";
import { viteSingleFile } from "vite-plugin-singlefile";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig({
  base: "./",
  publicDir: false,
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(),
    {
      name: "copy-static",
      closeBundle() {
        for (const f of ["manifest.json", "sw.js", "icon-192.png", "icon-512.png"]) {
          fs.copyFileSync(path.resolve(__dirname, f), path.resolve(__dirname, "dist", f));
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname),
    },
  },
});
