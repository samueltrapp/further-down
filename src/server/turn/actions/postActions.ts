import { CharType } from "../../../types/characters.ts";

export function resolvePostActions(
  characters: CharType[],
  logMessages: string[],
) {
  return { characters, logMessages };
}
