import { ArmorType } from "../../../../types/equipables/armors.ts";

export const porousBody: ArmorType = {
  name: "porous body",
  team: "enemy",
  constitution: 1,
  protection: 0,
  affinities: {
    defense: 0.1,
    resistance: 1,
    plating: 0.1,
    padding: 0.5,
    dampening: 1.4,
    warding: 1.8,
  },
  level: 1,
  rarity: 0,
  description: "A mushroom's squishy little body.",
};
