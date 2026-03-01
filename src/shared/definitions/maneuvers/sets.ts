import {
  ManeuverName,
  ManeuverType,
} from "../../../types/equipables/actions.ts";
import { quicksilver } from "./collection/quicksilver.ts";

const maneuvers: [ManeuverName, ManeuverType][] = [
  [ManeuverName.QUICKSILVER, quicksilver],
];

export const maneuverMap = new Map<ManeuverName, ManeuverType>(maneuvers);
export const maneuverCollection = Array.from(maneuverMap.keys());
