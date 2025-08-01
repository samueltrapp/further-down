import { CharType, EnemyType, PlayerType } from "../../../types/characters.ts";
import { TurnType } from "../../../types/game.ts";
import { findCharacter } from "./battle.ts";

export function getCharacterDetails(characters: CharType[], turn: TurnType) {
  const actor = findCharacter(characters, turn.issuerId);
  const recipients = turn.targetIds.map((targetId: EnemyType) =>
    findCharacter(characters, targetId),
  );
  return { actor, recipients } as {
    actor: [PlayerType, number];
    recipients: [EnemyType, number][];
  };
}
