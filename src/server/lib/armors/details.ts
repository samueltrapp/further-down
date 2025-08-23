import { ArmorType } from "../../../types/equipables/armors.ts";

export const armDetails: ArmorType[] = [
  {
    name: "leather",
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
    level: 1,
    rarity: 0,
  },
  {
    name: "platemail",
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
    level: 1,
    rarity: 0,
  },
  {
    name: "robe",
    constitution: 5,
    protection: 1,
    affinities: {
      defense: 0.4,
      resistance: 2.1,
      plating: 0.1,
      padding: 0.7,
      dampening: 2,
      warding: 0.8,
    },
    level: 1,
    rarity: 0,
  },
  {
    name: "tunic",
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
    level: 1,
    rarity: 0,
  },
];
