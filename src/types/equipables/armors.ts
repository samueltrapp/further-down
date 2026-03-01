import { EnchantmentType } from "./enchantments.ts";

export enum ArmorName {
  LEATHER = "leather",
  PLATEMAIL = "platemail",
  ROBE = "robe",
  TUNIC = "tunic",
}

type DefensiveAffinitiesType = {
  defense: number;
  resistance: number;
  plating: number;
  padding: number;
  dampening: number;
  warding: number;
};

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
