import { ManeuverName } from "../../../types/equipables/actions.ts";
import { acheFn } from "./implementation/ache.ts";
import { CharactersType } from "../../../types/game.ts";
import { MnvOrTctFnType } from "../../../types/events/turn.ts";
import { quicksilverFn } from "./implementation/quicksilver.ts";

type ResolvedManeuverFnType = ({
  characters,
  sourceId,
  targetIds,
}: MnvOrTctFnType) => {
  characterResults: CharactersType;
  logResults: string[];
};

const maneuvers: [ManeuverName, ResolvedManeuverFnType][] = [
  ["ache", acheFn],
  ["quicksilver", quicksilverFn],
  // ["fireburst", fireburstFn],
  // ["slap", slapFn]
];

const maneuverMap = new Map<ManeuverName, ResolvedManeuverFnType>(maneuvers);

export const getMnvFn = (
  maneuver: ManeuverName,
): ResolvedManeuverFnType | undefined => maneuverMap.get(maneuver);
