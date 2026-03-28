import { HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { randNum } from "../../shared/utils.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { weaponMap } from "../../shared/definitions/weapons/sets.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const calcDamage = (step: HitStep, ctx: ActionCtx) => {
  const { damageType, strength } = { ...step };
  const { characters, sourceId, targetIds } = { ...ctx };
  const source = characters[sourceId];

  if (!source) {
    return ctx;
  }

  const stats = source.stats;
  const weaponName = source?.equipped.weapon;
  const weapon = weaponName && weaponMap.get(weaponName);

  if (!weapon) {
    return ctx;
  }

  const affinities = weapon.affinities;
  const baseDamage = weapon.power + createSpread(weapon.spread);

  const {
    physical: phAff,
    magical: mgAff,
    bladed: bldAff,
    blunt: bltAff,
    elemental: eleAff,
    psychic: psyAff,
  } = affinities;

  const damage = () => {
    switch (damageType) {
      case "bladed":
        return baseDamage + phAff * stats.physical + bltAff * stats.bladed;
      case "blunt":
        return baseDamage + phAff * stats.physical + bldAff * stats.blunt;
      case "elemental":
        return baseDamage + mgAff * stats.magical + eleAff * stats.elemental;
      case "psychic":
        return baseDamage + mgAff * stats.magical + psyAff * stats.psychic;
      default:
        return 0;
    }
  };

  const damageInstance = strength * damage();
  const freshMap = new Map();
  targetIds?.forEach((targetId) => {
    const existingInstance = ctx.instance.get(targetId);
    freshMap.set(targetId, {
      ...existingInstance,
      damage: trunc((existingInstance?.damage || 0) + damageInstance),
    });
  });

  const stepAccuracy = source.stats.accuracy + step.accuracy;
  const stepRoll = randNum(100);

  return {
    ...ctx,
    toHit: stepRoll,
    accuracy: stepAccuracy,
    instance: freshMap,
  };
};

export const applyDamage = (ctx: ActionCtx) => {
  const { characters, instance, messages } = { ...ctx };

  instance.forEach((instanceDtl, targetId) => {
    if (instanceDtl.evaded) {
      messages.steps?.push(`Missed ${characters[targetId].name}.`);
    } else {
      const character = characters[targetId];
      const reducedDamage = limitToZero(
        trunc(instanceDtl.damage - instanceDtl.mitigation),
      );
      if (character?.stats?.life) {
        character.stats.life = limitToZero(
          character.stats.life - reducedDamage,
        );
      }
      messages.steps?.push(
        `Hit ${characters[targetId].name} for ${reducedDamage} damage (${instanceDtl.damage} - ${instanceDtl.mitigation}).`,
      );
    }
  });

  return ctx;
};
