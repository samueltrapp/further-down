import {
  OffensiveAffinitiesType,
  AspectType,
  EnchantmentType,
} from "./enchantments.ts";

export type WeaponName = "cutlass" | "hammer" | "scepter" | "periapt";

export type WeaponType = {
  name: WeaponName;
  power: number;
  spread: number;
  affinities: OffensiveAffinitiesType;
  level: number;
  rarity: number;
  equipped: boolean;
  aspects?: AspectType[];
  enchantments?: EnchantmentType[];
};
