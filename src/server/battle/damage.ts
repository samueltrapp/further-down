import { HitStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { randNum } from "../../shared/utils.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { weaponMap } from "../../shared/definitions/weapons/sets.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const calcDamage = (ctx: ActionCtx, step: HitStep) => {
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
    martial: mrAff,
    mystic: msAff,
    bladed: bldAff,
    blunt: bltAff,
    elemental: eleAff,
    psychic: psyAff,
  } = affinities;

  const damage = () => {
    switch (damageType) {
      case "bladed":
        return (
          baseDamage +
          mrAff * stats.discipline.martial +
          bltAff * stats.mastery.bladed
        );
      case "blunt":
        return (
          baseDamage +
          mrAff * stats.discipline.martial +
          bldAff * stats.mastery.blunt
        );
      case "elemental":
        return (
          baseDamage +
          msAff * stats.discipline.mystic +
          eleAff * stats.mastery.elemental
        );
      case "psychic":
        return (
          baseDamage +
          msAff * stats.discipline.mystic +
          psyAff * stats.mastery.psychic
        );
      default:
        return 0;
    }
  };

  const damageInstance = strength * damage();
  const newInstance = new Map();
  targetIds?.forEach((targetId) => {
    const existingInstance = ctx.instance.get(targetId);
    newInstance.set(targetId, {
      ...existingInstance,
      damage: trunc((existingInstance?.damage || 0) + damageInstance),
    });
  });

  const stepAccuracy = source.stats.discipline.accuracy + step.accuracy;
  ctx.toHit = randNum(100);
  ctx.accuracy = stepAccuracy;
  ctx.instance = newInstance;

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
