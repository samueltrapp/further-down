import { ArmorName } from "./armors.ts";
import { EnchantmentName } from "./enchantments.ts";
import { ManeuverName } from "./maneuvers.ts";
import { WeaponName } from "./weapons.ts";
import {BlessingName} from "./blessings.ts";

export type SingleRewardType =
  | ArmorName[]
  | BlessingName[]
  | EnchantmentName[]
  | ManeuverName[]
  | WeaponName[];
