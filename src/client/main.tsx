import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GameProvider } from "./contexts/GameProvider.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <App />
    </GameProvider>
  </StrictMode>,
);
