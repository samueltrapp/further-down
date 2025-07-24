import { CharType } from "../../types/game.ts";

type CharTurnType = {
  id: string;
  lastTurn: number;
  speed: number;
};

export const resolveTurnOrder = (characters: CharType[]): string[] => {
  const charTurns = characters.map((character) => ({
    id: character.id,
    lastTurn: character.lastTurn,
    speed: character.stats.speed,
  }));

  charTurns.sort((a: CharTurnType, b: CharTurnType) => {
    const relation = -1 * (a.speed - b.speed);
    if (relation !== 0) return relation;
    else {
      // Break ties by picking the player who went longest ago
      return -1 * (a.lastTurn - b.lastTurn);
    }
  });

  return charTurns.map((charTurn) => charTurn.id);
};
