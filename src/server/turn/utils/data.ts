import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import { findCharacter } from "./battle.ts";
import { PlayerTurnType } from "../../../types/events/turn.ts";
import { CharactersType } from "../../../types/game.ts";

export function getCharacterDetails(
  characters: CharactersType,
  turn: PlayerTurnType,
) {
  const source = findCharacter(characters.players, turn.issuerId);
  const targets = turn.targetIds.map((targetId: string) =>
    findCharacter(characters.enemies, targetId),
  );
  return { source, targets } as {
    source: [PlayerType, number];
    targets: [EnemyType, number][];
  };
}
