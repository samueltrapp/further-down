import { CharType, EnemyType, PlayerType } from "../../../types/characters.ts";
import { PlayerTurnType } from "../../../types/game.ts";
import { findCharacter } from "./battle.ts";

export function getCharacterDetails(
  characters: CharType[],
  turn: PlayerTurnType,
) {
  const actor = findCharacter(characters, turn.issuerId);
  const recipients = turn.targetIds.map((targetId) =>
    findCharacter(characters, targetId),
  );
  return { actor, recipients } as {
    actor: [PlayerType, number];
    recipients: [EnemyType, number][];
  };
}
