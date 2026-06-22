import { ArmorType } from "../../../../types/equipables/armors.ts";

export const tunic: ArmorType = {
  name: "tunic",
  team: "player",
  constitution: 5,
  protection: 3,
  affinities: {
    defense: 0.9,
    resistance: 1.7,
    plating: 0.7,
    padding: 1,
    dampening: 1.2,
    warding: 1.7,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Medium magical armor",
};
