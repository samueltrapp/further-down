import { ArmorType } from "../../../../types/equipables/armors.ts";

export const tunic: ArmorType = {
  name: "tunic",
  team: "player",
  block: 3,
  finesse: 7,
  protection: 4,
  affinities: {
    defense: 0.9,
    resistance: 1.7,
    plating: 0.7,
    padding: 1,
    dampening: 1.2,
    warding: 1.7,
  },
  socketSize: 2,
  tier: 1,
  rarity: 0,
  description: "Medium magical armor",
};
