import { WeaponName, WeaponType } from "../../../types/equipables/weapons.ts";
import { cutlass } from "./collection/cutlass.ts";
import { hammer } from "./collection/hammer.ts";
import { periapt } from "./collection/periapt.ts";
import { scepter } from "./collection/scepter.ts";

const weapons: [WeaponName, WeaponType][] = [
  [WeaponName.CUTLASS, cutlass],
  [WeaponName.HAMMER, hammer],
  [WeaponName.HAMMER, periapt],
  [WeaponName.SCEPTER, scepter],
];

export const weaponMap = new Map<WeaponName, WeaponType>(weapons);
export const weaponCollection = Array.from(weaponMap.keys());
