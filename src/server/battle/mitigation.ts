import { DamageType, HitStep } from "../../types/equipables/maneuvers.ts";
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

  instance.forEach((instanceDtl, targetId) => {
    const character = characters[targetId];
    const evasion = character?.stats
      ? step.damageType === "bladed" || step.damageType === "blunt"
        ? character.stats.discipline.dodge
        : character.stats.discipline.negation
      : 0;
    instanceDtl.evaded = ctx.toHit > ctx.accuracy - evasion;
  });

  return ctx;
};

function getModifiedMitigation(
  armor: ArmorType,
  damageType: DamageType,
  stats: StatsType,
) {
  const affinities = armor.affinities;

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
      return dfAff * stats.discipline.defense + pltAff * stats.mastery.padding;
    case "bladed":
      return dfAff * stats.discipline.defense + pddAff * stats.mastery.plating;
    case "elemental":
      return (
        rsAff * stats.discipline.resistance + dmpAff * stats.mastery.dampening
      );
    case "psychic":
      return (
        rsAff * stats.discipline.resistance + wrdAff * stats.mastery.warding
      );
    default:
      return 0;
  }
}

export const calcMitigation = (ctx: ActionCtx, damageType: DamageType) => {
  const { characters, instance } = { ...ctx };

  if (!instance || instance.size === 0) {
    return ctx;
  }

  instance?.forEach((instanceDtl, targetId) => {
    const character = characters[targetId];
    const armor = character?.equipped.armor
      ? armorMap.get(character.equipped.armor)
      : null;
    let totalMitigation = 0;
    if (armor) {
      const baseMitigation = armor?.block ?? 0;
      const modifiedMitigation = getModifiedMitigation(
        armor,
        damageType,
        character.stats,
      );
      totalMitigation = baseMitigation + modifiedMitigation;
    }
    instanceDtl.mitigation = trunc(
      (instanceDtl?.mitigation || 0) + totalMitigation,
    );
  });

  return ctx;
};

export const handleMitigation = (ctx: ActionCtx, step: HitStep) => {
  return calcMitigation(ctx, step.damageType);
};
