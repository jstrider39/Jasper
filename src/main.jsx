import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import TreeGridApp from "./TreeGridApp";
import MovePanelManager from "./MovePanelManager";
import MovePanelApp from "./MovePanelApp";
import DataGridApp from "./cssGrid/DataGridApp";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <DataGridApp />
  // <MovePanelApp />
  // <TreeGridApp />
  // </StrictMode>
);
