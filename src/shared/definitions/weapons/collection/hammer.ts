import { WeaponType } from "../../../../types/equipables/weapons.ts";

export const hammer: WeaponType = {
  name: "hammer",
  team: "player",
  power: 5,
  spread: 1,
  affinities: {
    martial: 1.7,
    mystic: 1.2,
    bladed: 0.2,
    blunt: 2.0,
    elemental: 1.1,
    psychic: 1.4,
  },
  socketSize: 2,
  level: 1,
  rarity: 0,
  description: "Hammer description",
};
