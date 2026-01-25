import { BattleGrade, CharactersType } from "../../types/game.ts";
import { randomId } from "../utils/character.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import shroomlet from "../../shared/enemies/shroomlet.ts";
import { EnemyType } from "../../types/individual/characters.ts";

export const setBlankBattle = (characters: CharactersType) => ({
  round: 1,
  speedElapsed: 0,
  turnOrder: resolveTurnOrder(characters),
  grade: BattleGrade.MODERATE,
});

export const pickEnemies = (): [string, EnemyType][] => ([
  [randomId(10), structuredClone(shroomlet)],
  [randomId(10), structuredClone(shroomlet)],
  [randomId(10), structuredClone(shroomlet)],
  [randomId(10), structuredClone(shroomlet)],
]);
