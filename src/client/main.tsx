import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BattleProvider } from "./contexts/BattleProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BattleProvider>
      <App />
    </BattleProvider>
  </StrictMode>,
);
