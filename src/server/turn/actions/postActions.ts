import { CharactersType } from "../../../types/game.ts";

export function resolvePostActions(
  characters: CharactersType,
  logMessages: string[],
) {
  return { characters, logMessages };
}
