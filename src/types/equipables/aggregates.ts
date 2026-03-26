import { ArmorName } from "./armors.ts";
import { EnchantmentName } from "./enchantments.ts";
import { ManeuverName } from "./maneuvers.ts";
import { WeaponName } from "./weapons.ts";

export type SingleRewardType =
  | ArmorName[]
  | EnchantmentName[]
  | ManeuverName[]
  | WeaponName[];
