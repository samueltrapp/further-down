import { WeaponType } from "../../../../types/equipables/weapons.ts";

export const periapt: WeaponType = {
  name: "periapt",
  team: "player",
  power: 9,
  spread: 4,
  affinities: {
    martial: 0.6,
    mystic: 1.8,
    bladed: 1,
    blunt: 0.2,
    elemental: 1,
    psychic: 1.9,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Periapt description",
};
