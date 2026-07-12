import { HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { ArmorType } from "../../types/equipables/armors.ts";
import { armorMap } from "../../shared/definitions/armors/sets.ts";
import { trunc } from "../utils/battle.ts";

export const calcEvasion = (step: HitStep, ctx: ActionCtx) => {
  const { characters, instance } = { ...ctx };

  if (!instance || instance.size === 0) {
    return ctx;
  }

  const newInstance = new Map();
  instance.forEach((instanceDtl, targetId) => {
    const character = characters[targetId];
    const evasion = character?.stats
      ? step.damageType === "bladed" || step.damageType === "blunt"
        ? character.stats.discipline.dodge
        : character.stats.discipline.negation
      : 0;
    const evaded = ctx.toHit > ctx.accuracy - evasion;

    newInstance.set(targetId, { ...instanceDtl, evaded });
  });

  ctx.instance = newInstance;
  return ctx;
};

export const calcMitigation = (step: HitStep, ctx: ActionCtx) => {
  const { damageType } = { ...step };
  const { characters, instance } = { ...ctx };

  if (!instance || instance.size === 0) {
    return ctx;
  }

  const mitigation = (targetStat: StatsType, armor: ArmorType) => {
    const affinities = armor.affinities;
    const baseMitigation = armor.block;

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
          dfAff * targetStat.discipline.defense +
          pltAff * targetStat.mastery.padding
        );
      case "bladed":
        return (
          baseMitigation +
          dfAff * targetStat.discipline.defense +
          pddAff * targetStat.mastery.plating
        );
      case "elemental":
        return (
          baseMitigation +
          rsAff * targetStat.discipline.resistance +
          dmpAff * targetStat.mastery.dampening
        );
      case "psychic":
        return (
          baseMitigation +
          rsAff * targetStat.discipline.resistance +
          wrdAff * targetStat.mastery.warding
        );
      default:
        return 0;
    }
  };

  const newInstance = new Map();
  instance?.forEach((instanceDtl, targetId) => {
    const character = characters[targetId];
    const armor = character?.equipped.armor
      ? armorMap.get(character.equipped.armor)
      : null;
    const mitigationInstance =
      character?.stats && armor ? mitigation(character.stats, armor) : 0;

    newInstance.set(targetId, {
      ...instanceDtl,
      mitigation: trunc((instanceDtl?.mitigation || 0) + mitigationInstance),
    });
  });

  ctx.instance = newInstance;
  return ctx;
};
