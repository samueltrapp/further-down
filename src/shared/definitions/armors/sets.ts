import { ArmorName, ArmorType } from "../../../types/equipables/armors.ts";
import { leather } from "./collection/leather.ts";
import { platemail } from "./collection/platemail.ts";
import { robe } from "./collection/robe.ts";
import { tunic } from "./collection/tunic.ts";

const armors: [ArmorName, ArmorType][] = [
  [ArmorName.LEATHER, leather],
  [ArmorName.PLATEMAIL, platemail],
  [ArmorName.ROBE, robe],
  [ArmorName.TUNIC, tunic],
];

export const armorMap = new Map<ArmorName, ArmorType>(armors);
export const armorCollection = Array.from(armorMap.keys());
