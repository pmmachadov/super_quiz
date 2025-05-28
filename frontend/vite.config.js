import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === "production" ? "/super-quiz/" : "/",
  server: {
    port: 5173, // Frontend en puerto 5173
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000", // Backend en puerto 3000
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
