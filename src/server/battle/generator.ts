import { BattleGrade, CharactersType } from "../../types/game.ts";
import { randomId } from "../utils/data.ts";
import { EnemyType } from "../../types/individual/characters.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import shroomlet from "../lib/enemies/shroomlet.ts";

export const setBlankBattle = (characters: CharactersType) => ({
  round: 1,
  speedElapsed: 0,
  turnOrder: resolveTurnOrder(characters),
  grade: BattleGrade.MODERATE,
});

export const pickEnemies = () => {

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
