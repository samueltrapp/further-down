import { EnemyType, PlayerType } from "../../../types/individual/characters.ts";
import { findCharacter } from "./battle.ts";
import { PlayerTurnType } from "../../../types/turns.ts";
import { CharactersType } from "../../../types/game.ts";

export function getCharacterDetails(
  characters: CharactersType,
  turn: PlayerTurnType,
) {
  const actor = findCharacter(characters.players, turn.issuerId);
  const recipients = turn.targetIds.map((targetId: string) =>
    findCharacter(characters.enemies, targetId),
  );
  return { actor, recipients } as {
    actor: [PlayerType, number];
    recipients: [EnemyType, number][];
  };
}
