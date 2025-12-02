import { getMnvFn } from "../../lib/maneuvers/fnMap.ts";
import { getTacticFn } from "../../lib/tactics/fnMap.ts";
import {
  EnemyServerTurnType,
  PlayerTurnType,
} from "../../../types/events/turn.ts";
import { CharactersType } from "../../../types/game.ts";

export function resolveManeuver(
  characters: CharactersType,
  turn: PlayerTurnType,
) {
  const { maneuver, sourceId, targetIds } = turn;
  const mnvFn = getMnvFn(maneuver);
  const { characterResults, logResults } = mnvFn
    ? mnvFn({ characters, sourceId, targetIds })
    : { characterResults: characters, logResults: [] };
  return { characters: characterResults, logMessages: logResults };
}

export function resolveTactic(
  characters: CharactersType,
  turn: EnemyServerTurnType,
) {
  const { tactic, sourceId, targetIds } = turn;
  const tacticFn = getTacticFn(tactic);
  const { characterResults, logResults } = tacticFn
    ? tacticFn({ characters, sourceId, targetIds })
    : { characterResults: characters, logResults: [] };
  return {
    characters: characterResults,
    logMessages: logResults,
  };
}
