import { ArmorType } from "../../../../types/equipables/armors.ts";

export const leather: ArmorType = {
  name: "leather",
  team: "player",
  constitution: 5,
  protection: 2,
  affinities: {
    defense: 1.8,
    resistance: 1.3,
    plating: 0.6,
    padding: 0.9,
    dampening: 0.8,
    warding: 0.5,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Medium physical armor",
};
