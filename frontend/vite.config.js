import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Usar puerto 3000 para el frontend en lugar de 5173
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:5173", // El backend sigue en 5173
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
