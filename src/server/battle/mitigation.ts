import { HitStep } from "../../types/equipables/actions.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { StatsType } from "../../types/individual/stats.ts";

export const calcMitigation = (step: HitStep, ctx: ActionCtx) => {
  const { damageType } = step;
  const { characters, enemyTargetIds, playerTargetIds } = ctx;
  const defenders = (playerTargetIds || enemyTargetIds)?.map((id) => ({
    id: id,
    stats: characters[id]?.stats,
  }));

  if (!defenders || defenders.length === 0) {
    return ctx;
  }

  const mitigation = (targetStat: StatsType) => {
    switch (damageType) {
      case "blunt":
        return targetStat.defense + targetStat.plating;
      case "bladed":
        return targetStat.defense + targetStat.padding;
      case "elemental":
        return targetStat.resistance + targetStat.dampening;
      case "psychic":
        return targetStat.resistance + targetStat.warding;
      default:
        return 0;
    }
  };

  const mitigationMap = new Map();
  defenders?.forEach((defender) => {
    if (defender.stats) {
      const defensiveStats = {
        evasion: defender.stats.evasion,
        reduction: mitigation(defender.stats),
      };

      mitigationMap.set(defender.id, defensiveStats);
    }
  });

  return {
    ...ctx,
    mitigation: mitigationMap,
  };
};
