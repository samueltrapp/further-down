import {
  BlessingName,
  BlessingType,
} from "../../../types/equipables/blessings.ts";
import eternalFlame from "./collection/eternalFlame.ts";
import tempest from "./collection/tempest.ts";

const blessings: [BlessingName, BlessingType][] = [
  ["eternal flame", eternalFlame],
  ["tempest", tempest],
];

export const blessingMap = new Map<BlessingName, BlessingType>(blessings);
export const blessingCollection = Array.from(blessingMap.keys());
