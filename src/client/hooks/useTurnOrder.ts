import { useContext } from "react";
import { GameContext } from "../contexts/GameContext.tsx";

export function useTurnOrder() {
  const game = useContext(GameContext);
  const characters = game?.data?.characters;
  const characterId = game?.data?.battle?.turnOrder[0];
  return characters && characterId ? characters[characterId] : null;
}
