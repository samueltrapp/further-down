import { ArmorType } from "../../../../types/equipables/armors.ts";

export const porousBody: ArmorType = {
  name: "porous body",
  team: "enemy",
  block: 1,
  finesse: 7,
  protection: 2,
  affinities: {
    defense: 0.1,
    resistance: 1,
    plating: 0.1,
    padding: 0.5,
    dampening: 1.4,
    warding: 1.8,
  },
  socketSize: 2,
  tier: 1,
  rarity: 0,
  description: "A mushroom's squishy little body.",
};
