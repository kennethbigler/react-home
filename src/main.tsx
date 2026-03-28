import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./wrappers/WithTheme";
import "./index.css";

const rootEl = document.getElementById("root");
if (!rootEl) {
  throw new Error("Root element #root not found in document.");
}

ReactDOM.createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
