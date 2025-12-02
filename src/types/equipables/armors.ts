import { DefensiveAffinitiesType, EnchantmentType } from "./enchantments.ts";

export type ArmorName = "leather" | "platemail" | "robe" | "tunic";

export type ArmorType = {
  name: ArmorName;
  protection: number;
  constitution: number;
  affinities: DefensiveAffinitiesType;
  level: number;
  rarity: number;
  enchantments?: EnchantmentType[];
  description: string;
};
