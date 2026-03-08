import { WeaponType } from "../../../../types/equipables/weapons.ts";

export const cutlass: WeaponType = {
  name: "cutlass",
  team: "player",
  power: 7,
  spread: 2,
  affinities: {
    physical: 1.2,
    magical: 0,
    bladed: 1.8,
    blunt: 1,
    elemental: 1,
    psychic: 0.5,
  },
  level: 1,
  rarity: 0,
  description: "Cutlass description",
};
