import { ArmorType } from "../../../../types/equipables/armors.ts";

export const robe: ArmorType = {
  name: "robe",
  team: "player",
  block: 1,
  finesse: 8,
  protection: 2,
  affinities: {
    defense: 0.4,
    resistance: 2.1,
    plating: 0.1,
    padding: 0.7,
    dampening: 2,
    warding: 0.8,
  },
  socketSize: 2,
  tier: 1,
  rarity: 0,
  description: "Light magical armor",
};
