import { DamageType, HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { randNum } from "../../shared/utils.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { weaponMap } from "../../shared/definitions/weapons/sets.ts";
import { WeaponType } from "../../types/equipables/weapons.ts";
import { StatsType } from "../../types/individual/stats.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

function getBaseDamage(weapon: WeaponType) {
  return weapon.power + createSpread(weapon.spread);
}

function getModifiedDamage(
  weapon: WeaponType,
  damageType: DamageType,
  stats: StatsType,
) {
  const affinities = weapon.affinities;

  const {
    martial: mrAff,
    mystic: msAff,
    bladed: bldAff,
    blunt: bltAff,
    elemental: eleAff,
    psychic: psyAff,
  } = affinities;

  switch (damageType) {
    case "bladed":
      return mrAff * stats.discipline.martial + bltAff * stats.mastery.bladed;
    case "blunt":
      return mrAff * stats.discipline.martial + bldAff * stats.mastery.blunt;
    case "elemental":
      return msAff * stats.discipline.mystic + eleAff * stats.mastery.elemental;
    case "psychic":
      return msAff * stats.discipline.mystic + psyAff * stats.mastery.psychic;
    default:
      return 0;
  }
}

function getModifiedAccuracy(damageType: DamageType, stats: StatsType) {
  switch (damageType) {
    case "bladed":
    case "blunt":
      return stats.discipline.precision;
    case "elemental":
    case "psychic":
      return stats.discipline.control;
    default:
      return 0;
  }
}

export const calcDamage = (
  ctx: ActionCtx,
  damageType: DamageType,
  strength: number,
) => {
  const { characters, sourceId } = { ...ctx };
  const source = characters[sourceId];

  if (!source) {
    return 0;
  }

  const stats = source.stats;
  const weaponName = source?.equipped.weapon;
  const weapon = weaponName && weaponMap.get(weaponName);

  if (!weapon) {
    return 0;
  }

  const baseDamage = getBaseDamage(weapon);
  const modifiedDamage = getModifiedDamage(weapon, damageType, stats);
  return (baseDamage + modifiedDamage) * strength;
};

export const calcAccuracy = (
  ctx: ActionCtx,
  damageType: DamageType,
  accuracy: number,
) => {
  const { characters, sourceId } = { ...ctx };
  const source = characters[sourceId];

  if (!source) {
    return 0;
  }

  const stats = source.stats;
  const modifiedAccuracy = getModifiedAccuracy(damageType, stats);
  return modifiedAccuracy + accuracy;
};

export const handleDamage = (ctx: ActionCtx, step: HitStep) => {
  const { targetIds } = ctx;

  const totalDamage = calcDamage(ctx, step.damageType, step.strength);
  targetIds?.forEach((targetId) => {
    const existingInstance = ctx.instance.get(targetId);
    if (existingInstance) {
      existingInstance.damage = trunc(
        (existingInstance?.damage || 0) + totalDamage,
      );
    }
  });

  return ctx;
};

export const handleAccuracy = (ctx: ActionCtx, step: HitStep) => {
  ctx.accuracy = calcAccuracy(ctx, step.damageType, step.accuracy);
  return ctx;
};

export const handleAttack = (ctx: ActionCtx, step: HitStep) => {
  ctx = handleDamage(ctx, step);
  ctx = handleAccuracy(ctx, step);
  ctx.toHit = randNum(100);
  return ctx;
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
      if (character?.stats?.core.life) {
        character.stats.core.life = limitToZero(
          character.stats.core.life - reducedDamage,
        );
      }
      messages.steps?.push(
        `Hit ${characters[targetId].name} for ${reducedDamage} damage (${instanceDtl.damage} - ${instanceDtl.mitigation}).`,
      );
    }
  });

  return ctx;
};
