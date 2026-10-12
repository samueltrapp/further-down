import { ArmorType } from "../../../../types/equipables/armors.ts";

export const platemail: ArmorType = {
  name: "platemail",
  team: "player",
  block: 5,
  finesse: 3,
  protection: 7,
  affinities: {
    defense: 2.4,
    resistance: 0.3,
    plating: 1.3,
    padding: 0.7,
    dampening: 0.2,
    warding: 0.4,
  },
  socketSize: 2,
  tier: 1,
  rarity: 0,
  description: "Heavy physical armor",
};
