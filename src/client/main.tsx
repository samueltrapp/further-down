import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BattleProvider } from "./contexts/BattleProvider.tsx";
import { LobbyProvider } from "./contexts/LobbyProvider.tsx";
import { CharacterProvider } from "./contexts/CharacterProvider.tsx";
import { RewardProvider } from "./contexts/RewardProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LobbyProvider>
      <CharacterProvider>
        <RewardProvider>
          <BattleProvider>
            <App />
          </BattleProvider>
        </RewardProvider>
      </CharacterProvider>
    </LobbyProvider>
  </StrictMode>,
);
