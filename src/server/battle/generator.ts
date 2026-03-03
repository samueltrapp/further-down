import {
  BattleGrade,
  BattleType,
  CharactersType,
  Victor,
} from "../../types/game.ts";
import { randomId } from "../utils/character.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import shroomlet from "../../shared/enemies/shroomlet.ts";
import { EnemyType } from "../../types/individual/characters.ts";

export const setBlankBattle = (characters: CharactersType): BattleType => ({
  grade: BattleGrade.MODERATE,
  messages: [],
  round: 1,
  speedElapsed: 0,
  turnOrder: resolveTurnOrder(characters),
  victor: Victor.NONE,
});

export const pickEnemies = (): [string, EnemyType][] => {
  const ids = [randomId(10), randomId(10), randomId(10), randomId(10)];
  return ids.map((id, index) => [id, structuredClone(shroomlet(id, index))]);
};
