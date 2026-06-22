import { WeaponType } from "../../../../types/equipables/weapons.ts";

export const cutlass: WeaponType = {
  name: "cutlass",
  team: "player",
  power: 7,
  spread: 2,
  affinities: {
    martial: 1.2,
    mystic: 0,
    bladed: 1.8,
    blunt: 1,
    elemental: 1,
    psychic: 0.5,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Cutlass description",
};
