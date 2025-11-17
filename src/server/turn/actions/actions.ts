import { getMnvFn } from "../../lib/maneuvers/fnMap.ts";
import { getTacticFn } from "../../lib/tactics/fnMap.ts";
import {
  EnemyServerTurnType,
  PlayerTurnType,
} from "../../../types/events/turn.ts";
import { CharactersType } from "../../../types/game.ts";

export function resolveManeuver(
  characters: CharactersType,
  logMessages: string[],
  turn: PlayerTurnType,
) {
  const { maneuver, sourceId, targetIds } = turn;
  const mnvFn = getMnvFn(maneuver);
  const characterResults = mnvFn ? mnvFn({characters, sourceId, targetIds}) : characters;
  return { characters: characterResults, logMessages };
}

export function resolveTactic(
  characters: CharactersType,
  logMessages: string[],
  turn: EnemyServerTurnType,
) {
  const { tactic } = turn;
  const tacticFn = getTacticFn(tactic);
  const characterResults = tacticFn ? tacticFn(characters) : characters;
  return {
    characters,
    logMessages,
  };
}
