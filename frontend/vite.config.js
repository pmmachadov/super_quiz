import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === "production" ? "/super_quiz/" : "/",
  build: {
    outDir: "../docs",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
}));
