import { ArmorType } from "../../../../types/equipables/armors.ts";

export const leather: ArmorType = {
  name: "leather",
  team: "player",
  block: 4,
  finesse: 6,
  protection: 5,
  affinities: {
    defense: 1.8,
    resistance: 1.3,
    plating: 0.6,
    padding: 0.9,
    dampening: 0.8,
    warding: 0.5,
  },
  socketSize: 2,
  tier: 1,
  rarity: 0,
  description: "Medium physical armor",
};
