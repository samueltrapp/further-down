import { EnchantmentType } from "./enchantments.ts";

export type WeaponName = "cutlass" | "hammer" | "periapt" | "scepter";

type OffensiveAffinitiesType = {
  physical: number;
  magical: number;
  bladed: number;
  blunt: number;
  elemental: number;
  psychic: number;
};

export type WeaponType = {
  name: WeaponName;
  power: number;
  spread: number;
  affinities: OffensiveAffinitiesType;
  level: number;
  rarity: number;
  equipped: boolean;
  enchantments?: EnchantmentType[];
  description: string;
};
