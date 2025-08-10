import { CharType } from "../../../types/individual/characters.ts";

export function resolvePostActions(
  characters: CharType[],
  logMessages: string[],
) {
  return { characters, logMessages };
}
