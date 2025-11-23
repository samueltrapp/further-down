import { EnemyType } from "../../../types/individual/characters.ts";

const shroomlet: Omit<EnemyType, "id"> = {
  name: "Shroomlet",
  team: "enemy",
  stats: {
    vitality: 0,
    currentHitPoints: 400,
    hitPoints: 400,
    currentSpeed: 20,
    speed: 20,
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
  },
  base: 6,
  effects: {
    burdens: [],
    favors: [],
    lastTurn: 0,
  },
  tactics: ["bonk"],
};

export default shroomlet;
