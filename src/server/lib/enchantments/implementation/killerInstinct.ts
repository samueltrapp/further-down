import {roll} from "../../../../common/utils.ts";
import {PlayerType} from "../../../../types/individual/characters.ts";

export const killerInstinct = {
  type: "damage",
  priority: 2,
  fn
};

function fn({source, damage}: {source: PlayerType, damage: number}) {
  const chance = 10 + (0.15 * source.stats.physical);
  const success = roll(chance);
  return success ? damage * (2 + 0.15 * source.stats.physical) : damage;
}