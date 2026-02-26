import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CitasDeServicioApp } from "./CitasDeServicioApp";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CitasDeServicioApp />
  </StrictMode>,
);
