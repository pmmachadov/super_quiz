import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/kahootClone2/",
  build: {
    outDir: "../dist", // Especificar el directorio de salida en la raíz del proyecto
    emptyOutDir: true, // Limpiar el directorio de salida antes de construir
  },
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
