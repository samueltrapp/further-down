import { WeaponName, WeaponType } from "../../../types/equipables/weapons.ts";
import { cutlass } from "./collection/cutlass.ts";
import { hammer } from "./collection/hammer.ts";
import { periapt } from "./collection/periapt.ts";
import { scepter } from "./collection/scepter.ts";
import { fungalAppendage } from "./collection/fungalAppendage.ts";

const weapons: [WeaponName, WeaponType][] = [
  ["cutlass", cutlass],
  ["fungal appendage", fungalAppendage],
  ["hammer", hammer],
  ["periapt", periapt],
  ["scepter", scepter],
];

export const weaponMap = new Map<WeaponName, WeaponType>(weapons);
export const weaponCollection = Array.from(weaponMap.keys());
