import { CharType } from "../../../types/characters.ts";
import { TurnType } from "../../../types/game.ts";
import { findCharacter } from "./combatUtils.ts";

export function getCharacterDetails(characters: CharType[], turn: TurnType) {
  const actor = findCharacter(characters, turn.issuerId);
  const recipients = turn.targetIds.map((targetId) =>
    findCharacter(characters, targetId),
  );
  return { actor, recipients };
}
