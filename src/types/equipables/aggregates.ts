import { ArmorName } from "./armors.ts";
import { EnchantmentName } from "./enchantments.ts";
import { ManeuverName } from "./actions.ts";
import { WeaponName } from "./weapons.ts";

export type SingleRewardType =
  | ArmorName[]
  | EnchantmentName[]
  | ManeuverName[]
  | WeaponName[];
