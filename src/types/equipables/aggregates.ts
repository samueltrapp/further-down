import { ArmorType } from "./armors.ts";
import { BlessingType } from "./blessings.ts";
import { CurseType } from "./curses.ts";
import { EnchantmentType } from "./enchantments.ts";
import { ManeuverType } from "./maneuvers.ts";
import { WeaponType } from "./weapons.ts";

export type SingleRewardType =
  | ArmorType[]
  | BlessingType[]
  | CurseType[]
  | EnchantmentType[]
  | ManeuverType[]
  | WeaponType[];
