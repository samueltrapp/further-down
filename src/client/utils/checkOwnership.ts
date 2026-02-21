import { EnemyType, PlayerType } from "../../types/individual/characters.ts";

export function checkOwnership(character: PlayerType | EnemyType | null) {
  if (!character || character?.team === "enemy") {
    return false;
  }
  const userId = localStorage.getItem("userId");
  return userId === character.userId;
}
