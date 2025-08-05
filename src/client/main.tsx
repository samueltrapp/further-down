import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BattleProvider } from "./contexts/BattleProvider.tsx";
import { LobbyProvider } from "./contexts/LobbyProvider.tsx";
import { CharacterProvider } from "./contexts/CharacterProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LobbyProvider>
      <CharacterProvider>
        <BattleProvider>
          <App />
        </BattleProvider>
      </CharacterProvider>
    </LobbyProvider>
  </StrictMode>,
);
