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
    vitality: 0,
    life: 400,
    maxLife: 400,
    speed: 20,
    maxSpeed: 20,
    physical: 3,
    magical: 5,
    bladed: 1,
    blunt: 1,
    elemental: 5,
    psychic: 8,
    defense: 1,
    resistance: 3,
    padding: 5,
    plating: 0,
    dampening: -1,
    warding: 3,
    evasion: 0,
    accuracy: 0,
  },
  equipped: {
    weapon: "fungal appendage",
    armor: "porous body",
    enchantments: [],
  },
  loadout: {
    armors: ["porous body"],
    enchantments: [],
    maneuvers: ["bonk", "pass"],
    weapons: ["fungal appendage"],
  },
  effects: {
    burdens: {},
    favors: {},
  },
  lastTurn: 0,
  isDead: false,
});

export default shroomlet;
