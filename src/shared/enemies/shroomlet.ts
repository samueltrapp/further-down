import { EnemyType } from "../../types/individual/characters.ts";

const numToChar = (num: number) => {
  switch (num) {
    case 0:
      return "A";
    case 1:
      return "B";
    case 2:
      return "C";
    case 3:
      return "D";
    default:
      return "X";
  }
};

const shroomlet = (id: string, index: number): EnemyType => ({
  id,
  name: `Shroomlet ${numToChar(index)}`,
  team: "enemy",
  stats: {
    core: {
      vitality: 0,
      protection: 0,
      life: 400,
      maxLife: 400,
      initiative: 0,
      finesse: 0,
      speed: 20,
      maxSpeed: 20,
    },
    discipline: {
      martial: 3,
      mystic: 5,
      defense: 1,
      resistance: 3,
      precision: 0,
      control: 0,
      dodge: 0,
      negation: 0,
    },
    mastery: {
      bladed: 1,
      blunt: 1,
      elemental: 5,
      psychic: 8,
      padding: 5,
      plating: 0,
      dampening: -1,
      warding: 3,
    },
  },
  equipped: {
    weapon: "fungal appendage",
    armor: "porous body",
    enchantments: [],
  },
  loadout: {
    armors: ["porous body"],
    enchantments: [],
    maneuvers: ["bonk"],
    weapons: ["fungal appendage"],
  },
  effects: {},
  burnSources: {},
  lastTurn: 0,
  isDead: false,
});

export default shroomlet;
