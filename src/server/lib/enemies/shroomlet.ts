import { EnemyType } from "../../../types/individual/characters.ts";

const shroomlet: EnemyType = {
  name: "Shroomlet",
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
  base: 6,
  effects: {
    burdens: {},
    favors: {},
  },
  lastTurn: 0,
  tactics: ["bonk"],
};

export default shroomlet;
