import { UnitType } from "../../types/individual/characters.ts";
import { CharactersType } from "../../types/game.ts";

type CharTurnType = {
  id: string;
  lastTurn: number;
  speed: number;
};

export const resolveTurnOrder = (characters: CharactersType): string[] => {
  const allCharacters = (characters.players as UnitType[]).concat(
    characters.enemies,
  );
  const charTurns = allCharacters.map((character) => ({
    id: character.id,
    lastTurn: character.effects.lastTurn,
    speed: character.stats.speed,
  }));

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
