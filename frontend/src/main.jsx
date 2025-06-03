import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const redirectFromGitHubPages = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const path = urlParams.get("path");

  if (path) {
    window.history.replaceState(null, null, "/" + path);
  }
};

if (window.location.hostname !== "localhost") {
  redirectFromGitHubPages();
}

ReactDOM.createRoot(document.getElementById("root")).render(
  React.createElement(React.StrictMode, null, React.createElement(App, null))
);
