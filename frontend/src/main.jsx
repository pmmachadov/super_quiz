import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Función para manejar redirecciones en GitHub Pages
const redirectFromGitHubPages = () => {
  // Compruebe si hay un parámetro 'path' en la URL al cargar
  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("path");

  if (path) {
    // Eliminar el parámetro 'path' de la URL y redirigir a la ruta real
    window.history.replaceState(null, null, "/" + path);
  }
};

// Ejecutar la redirección si estamos en GitHub Pages
if (window.location.hostname !== "localhost") {
  redirectFromGitHubPages();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
);
