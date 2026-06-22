import { ArmorType } from "../../../../types/equipables/armors.ts";

export const platemail: ArmorType = {
  name: "platemail",
  team: "player",
  constitution: 5,
  protection: 4,
  affinities: {
    defense: 2.4,
    resistance: 0.3,
    plating: 1.3,
    padding: 0.7,
    dampening: 0.2,
    warding: 0.4,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Heavy physical armor",
};
