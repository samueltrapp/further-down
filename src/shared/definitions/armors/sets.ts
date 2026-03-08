import { ArmorName, ArmorType } from "../../../types/equipables/armors.ts";
import { leather } from "./collection/leather.ts";
import { platemail } from "./collection/platemail.ts";
import { robe } from "./collection/robe.ts";
import { tunic } from "./collection/tunic.ts";

const armors: [ArmorName, ArmorType][] = [
  ["leather", leather],
  ["platemail", platemail],
  ["robe", robe],
  ["tunic", tunic],
];

export const armorMap = new Map<ArmorName, ArmorType>(armors);
export const armorCollection = Array.from(armorMap.keys());
