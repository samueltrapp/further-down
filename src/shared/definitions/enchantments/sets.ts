import {
  EnchantmentName,
  EnchantmentType,
} from "../../../types/equipables/enchantments.ts";
import { redFangEnch } from "./collection/redFang.ts";
import { sharpenTheBladeEnch } from "./collection/sharpenTheBlade.ts";
import { tallShadowEnch } from "./collection/tallShadow.ts";

const enchantments: [EnchantmentName, EnchantmentType][] = [
  ["red fang", redFangEnch],
  ["sharpen the blade", sharpenTheBladeEnch],
  ["tall shadow", tallShadowEnch],
];

export const enchantmentMap = new Map<EnchantmentName, EnchantmentType>(
  enchantments,
);
export const enchantmentCollection = Array.from(enchantmentMap.keys());
