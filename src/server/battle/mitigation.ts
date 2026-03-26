import { HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { ArmorType } from "../../types/equipables/armors.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { trunc } from "../utils/battle.ts";

export const calcMitigation = (step: HitStep, ctx: ActionCtx) => {
  const { damageType } = step;
  const { characters, targetIds } = ctx;
  const defenders = targetIds?.map((id) => ({
    id: id,
    stats: characters[id]?.stats,
    armor: characters[id]?.equipped.armor,
  }));

  if (!defenders || defenders.length === 0) {
    return ctx;
  }

  const mitigation = (targetStat: StatsType, armor: ArmorType) => {
    const affinities = armor.affinities;
    const baseMitigation = armor.protection;

    const {
      defense: dfAff,
      resistance: rsAff,
      padding: pddAff,
      plating: pltAff,
      dampening: dmpAff,
      warding: wrdAff,
    } = affinities;

    switch (damageType) {
      case "blunt":
        return (
          baseMitigation +
          dfAff * targetStat.defense +
          pddAff * targetStat.plating
        );
      case "bladed":
        return (
          baseMitigation +
          dfAff * targetStat.defense +
          pltAff * targetStat.padding
        );
      case "elemental":
        return (
          baseMitigation +
          rsAff * targetStat.resistance +
          dmpAff * targetStat.dampening
        );
      case "psychic":
        return (
          baseMitigation +
          rsAff * targetStat.resistance +
          wrdAff * targetStat.warding
        );
      default:
        return 0;
    }
  };

  const mitigationMap = new Map();
  defenders?.forEach((defender) => {
    const armor = defender.armor ? armorMap.get(defender.armor) : null;
    if (defender.stats && armor) {
      const evaded = ctx.toHit > ctx.accuracy - defender.stats.evasion;
      console.log(evaded, ctx.toHit, ctx.accuracy, defender.stats.evasion);
      const defensiveStats = {
        evaded,
        reduction: trunc(mitigation(defender.stats, armor)),
      };

      mitigationMap.set(defender.id, defensiveStats);
    }
  });

  return {
    ...ctx,
    mitigation: mitigationMap,
  };
};
