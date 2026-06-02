import {
  EnchantmentName,
  EnchantmentType,
} from "../../../types/equipables/enchantments.ts";
import { sharpenTheBladeEnch } from "./collection/sharpenTheBlade.ts";

const enchantments: [EnchantmentName, EnchantmentType][] = [
  ["sharpen the blade", sharpenTheBladeEnch],
];

export const enchantmentMap = new Map<EnchantmentName, EnchantmentType>(
  enchantments,
);
export const enchantmentCollection = Array.from(enchantmentMap.keys());
