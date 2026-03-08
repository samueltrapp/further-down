import {
  ManeuverName,
  ManeuverType,
} from "../../../types/equipables/actions.ts";
import { quicksilver } from "./collection/quicksilver.ts";
import { bonk } from "./collection/bonk.ts";
import { deluge } from "./collection/deluge.ts";
import pummel from "./collection/pummel.ts";
import ache from "./collection/ache.ts";
import { pass } from "./collection/pass.ts";

const maneuvers: [ManeuverName, ManeuverType][] = [
  ["ache", ache],
  ["bonk", bonk],
  ["deluge", deluge],
  ["pummel", pummel],
  ["quicksilver", quicksilver],
  ["pass", pass],
];

export const maneuverMap = new Map<ManeuverName, ManeuverType>(maneuvers);
export const maneuverCollection = Array.from(maneuverMap.keys()).filter(
  (maneuverName) => maneuverMap.get(maneuverName)?.team === "player",
);
