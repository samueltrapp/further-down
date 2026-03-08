import {
  ManeuverName,
  ManeuverType,
} from "../../../types/equipables/actions.ts";
import { quicksilver } from "./collection/quicksilver.ts";
import { bonk } from "./collection/bonk.ts";

const maneuvers: [ManeuverName, ManeuverType][] = [
  ["quicksilver", quicksilver],
  ["bonk", bonk],
];

export const maneuverMap = new Map<ManeuverName, ManeuverType>(maneuvers);
export const maneuverCollection = Array.from(maneuverMap.keys());
