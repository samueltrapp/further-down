import { HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { ArmorType } from "../../types/equipables/armors.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { trunc } from "../utils/battle.ts";

export const calcMitigation = (step: HitStep, ctx: ActionCtx) => {
  const { damageType } = { ...step };
  const { characters, instance } = { ...ctx };

  if (!instance || instance.size === 0) {
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

  const newInstance = new Map();
  instance?.forEach((instanceDtl, targetId) => {
    const character = characters[targetId];
    const armor = character.equipped.armor
      ? armorMap.get(character.equipped.armor)
      : null;
    if (character.stats && armor) {
      const evaded = ctx.toHit > ctx.accuracy - character.stats.evasion;
      const mitigationInstance = mitigation(character.stats, armor);

      newInstance.set(targetId, {
        ...instanceDtl,
        evaded,
        mitigation: trunc((instanceDtl?.mitigation || 0) + mitigationInstance),
      });
    }
  });

  return {
    ...ctx,
    instance: newInstance,
  };
};
