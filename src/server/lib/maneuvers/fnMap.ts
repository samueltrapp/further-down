import { ManeuverName } from "../../../types/equipables/actions.ts";
import { acheFn } from "./implementation/ache.ts";
import { CharactersType } from "../../../types/game.ts";
import { MnvOrTctFnType } from "../../../types/events/turn.ts";

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
  // ["fireburst", fireburstFn],
  // ["quicksilver", quicksilverFn],
  // ["slap", slapFn]
];

const maneuverMap = new Map<ManeuverName, ResolvedManeuverFnType>(maneuvers);

export const getMnvFn = (
  maneuver: ManeuverName,
): ResolvedManeuverFnType | undefined => maneuverMap.get(maneuver);
