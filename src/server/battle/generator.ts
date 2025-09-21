import { BattleGrade, CharactersType } from "../../types/game.ts";
import { randomId } from "../utils/data.ts";
import { EnemyType } from "../../types/individual/characters.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";

export const setBlankBattle = (characters: CharactersType) => ({
  round: 1,
  speedElapsed: 0,
  turnOrder: resolveTurnOrder(characters),
  grade: BattleGrade.MODERATE,
});

export const pickEnemies = () => {
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
    effects: {
      burdens: [],
      favors: [],
      lastTurn: 0,
    },
    tactics: ["spore burst", "gentle slap"],
  };

  return [
    {
      ...shroomlet,
      id: randomId(10),
    },
    {
      ...shroomlet,
      id: randomId(10),
    },
    {
      ...shroomlet,
      id: randomId(10),
    },
  ];
};
