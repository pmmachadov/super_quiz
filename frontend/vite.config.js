import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:5173",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
