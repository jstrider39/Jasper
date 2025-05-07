import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import TreeGridApp from "./TreeGridApp";
import MovePanelManager from "./MovePanelManager";
import MovePanelApp from "./MovePanelApp";
import DataGridApp from "./cssGrid/DataGridApp";
import { EnterApp } from "./WorkFlowTFormJson/EnterApp";
import ErrorBoundary from "./ErrorBoundary";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  // <DataGridApp />
  <ErrorBoundary>
    <EnterApp></EnterApp>
  </ErrorBoundary>
  // <MovePanelApp />
  // <TreeGridApp />
  // </StrictMode>
);
