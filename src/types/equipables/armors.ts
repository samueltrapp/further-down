import {
  AspectType,
  DefensiveAffinitiesType,
  EnchantmentType,
} from "./enchantments.ts";

export type ArmorName = "leather" | "platemail" | "robe" | "tunic";

export type ArnorType = {
  name: ArmorName;
  protection: number;
  affinities: DefensiveAffinitiesType;
  level: number;
  rarity: number;
  aspects?: AspectType[];
  enchantments?: EnchantmentType[];
};
