import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import FilflexPage from "./FilflexPage";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FilflexPage />
  </StrictMode>,
);
