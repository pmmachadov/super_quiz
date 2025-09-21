import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    historyApiFallback: true,
    proxy: {
      // Route spaced-repetition API to the dedicated API server (api-server.js on 3001)
      "/api/spaced-repetition": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api\/spaced-repetition/, "/api/spaced-repetition"),
      },
      // All other /api requests (quizzes, etc.) go to the main backend server on 3000
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
