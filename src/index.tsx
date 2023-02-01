import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./wrappers/WithStore";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import "./styles/index.css";

const container =
  document.getElementById("root") || document.createElement("div");
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
