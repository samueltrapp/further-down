import { BattleGrade, CharactersType } from "../../types/game.ts";
import { randomId } from "../utils/data.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import shroomlet from "../lib/enemies/shroomlet.ts";
import { EnemyType } from "../../types/individual/characters.ts";

export const setBlankBattle = (characters: CharactersType) => ({
  round: 1,
  speedElapsed: 0,
  turnOrder: resolveTurnOrder(characters),
  grade: BattleGrade.MODERATE,
});

export const pickEnemies = (): Record<string, EnemyType> => ({
  [randomId(10)]: shroomlet,
  [randomId(10)]: shroomlet,
  [randomId(10)]: shroomlet,
  [randomId(10)]: shroomlet,
});
