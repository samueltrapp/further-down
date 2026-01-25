import { EnchantmentName } from "../../../types/equipables/enchantments.ts";
import {thousandCuts} from "./implementation/thousandCuts.ts";
import {killerInstinct} from "./implementation/killerInstinct.ts";
import {discipline} from "./implementation/discipline.ts";
import {redFang} from "./implementation/redFang.ts";

const enchantments = [
  ["discipline", discipline],
  ["thousandCuts", thousandCuts],
  ["redFang", redFang],
  ["killerInstinct", killerInstinct]
];

export const enchantmentMap = new Map<EnchantmentName, any>(enchantments);
