import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found in document.");
}

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
