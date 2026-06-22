import { WeaponType } from "../../../../types/equipables/weapons.ts";

export const scepter: WeaponType = {
  name: "scepter",
  team: "player",
  power: 3,
  spread: 0,
  affinities: {
    martial: 1.1,
    mystic: 1.9,
    bladed: 0,
    blunt: 1.5,
    elemental: 1.9,
    psychic: 1.4,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Scepter description",
};
