import { StatsType } from "../../../types/individual/stats.ts";
import { DamageType } from "../../../types/equipables/actions.ts";

export const calcRawEnemyDamage = (
  base: number,
  stats: StatsType,
  damageType: DamageType,
) => {
  switch (damageType) {
    case "bladed":
      return base + stats.bladed;
    case "blunt":
      return base + stats.blunt;
    case "elemental":
      return base + stats.elemental;
    case "psychic":
      return base + stats.psychic;
    default:
      return 0;
  }
};

export const limitToZero = (value: number) => Math.max(value, 0);
export const trunc = (value: number) => Math.trunc(value);
