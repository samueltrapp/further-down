import { CharactersType } from "../../types/game.ts";

type CharTurnType = {
  id: string;
  lastTurn: number;
  speed: number;
};

export const resolveTurnOrder = (characters: CharactersType): string[] => {
  const charTurns: { id: string; lastTurn: number; speed: number }[] = [];
  const charEntries = Object.entries(characters);
  for (const charEntry of charEntries) {
    charTurns.push({
      id: charEntry[0],
      lastTurn: charEntry[1].lastTurn,
      speed: charEntry[1].stats.speed,
    });
  }

  charTurns.sort((a: CharTurnType, b: CharTurnType) => {
    const relation = -1 * (a.speed - b.speed);
    if (relation !== 0) return relation;
    else {
      // Break ties by picking the player who went longest ago
      const order = a.lastTurn - b.lastTurn;
      // Or randomly by ID if that was also a tie
      const lastResort = a.id < b.id ? 1 : -1;
      return order !== 0 ? -1 * (a.lastTurn - b.lastTurn) : lastResort;
    }
  });

  return charTurns.map((charTurn) => charTurn.id);
};
