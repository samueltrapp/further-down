import { ManeuverName, ManeuverType } from "../../../types/equipables/actions.ts";
import { quicksilver } from "./collection/quicksilver.ts";

const maneuvers: [ManeuverName, ManeuverType][] = [
  ["quicksilver", quicksilver],
];

export const mnvFns = new Map<ManeuverName, ManeuverType>(maneuvers);
