import {
  EnchantmentName,
  EnchantmentType,
} from "../../../types/equipables/enchantments.ts";

const enchantments: [EnchantmentName, EnchantmentType][] = [];

export const enchantmentMap = new Map<EnchantmentName, EnchantmentType>(
  enchantments,
);
export const enchantmentCollection = Array.from(enchantmentMap.keys());
