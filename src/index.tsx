import React from "react";
import { createRoot } from "react-dom/client";
import App from "./wrappers/WithStore";
import { register } from "./serviceWorker";
import "./styles/index.css";

const container =
  document.getElementById("root") || document.createElement("div");
const root = createRoot(container);
root.render(<App />);
register();
