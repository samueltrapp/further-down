import {
  ManeuverName,
} from "../../../types/equipables/maneuvers.ts";
import {fireburstFn} from "./implementation/fireburst.ts";
import {acheFn} from "./implementation/ache.ts";
import {quicksilverFn} from "./implementation/quicksilver.ts";
import {slapFn} from "./implementation/slap.ts";

const maneuvers = [
  ["ache", acheFn]
  ["fireburst", fireburstFn],
  ["quicksilver", quicksilverFn],
  ["slap", slapFn]
]

const maneuverMap = new Map(maneuvers);

export const getMnvFn = (maneuver: ManeuverName) => maneuverMap.get(maneuver);
