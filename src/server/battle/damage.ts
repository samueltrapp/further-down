import { HitStep } from "../../types/equipables/actions.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { randNum } from "../../shared/utils.ts";
import { limitToZero, trunc } from "../utils/battle.ts";
import { randomInt } from "node:crypto";
import { weaponMap } from "../../shared/definitions/weapons/sets.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const calcDamage = (step: HitStep, ctx: ActionCtx) => {
  const { damageType, strength } = step;
  const { characters, sourceId } = ctx;
  const source = characters[sourceId];

  if (!source) {
    return ctx;
  }

  const stats = source.stats;

  /* Initialize weapon stats for weaponless enemies */
  let affinities = {
    physical: 1,
    magical: 1,
    bladed: 1,
    blunt: 1,
    elemental: 1,
    psychic: 1,
  };
  let baseDamage = 0;

  if (source.team === "player") {
    const weaponName = source?.equipped.weapon;
    const weapon = weaponName && weaponMap.get(weaponName);
    if (!weapon) {
      return ctx;
    }
    affinities = weapon.affinities;
    baseDamage = weapon.power + createSpread(weapon.spread);
  }

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

  const damageInstance = trunc(strength * damage());
  const stepAccuracy = source.stats.accuracy + step.accuracy;
  const stepRoll = randomInt(100);

  return {
    ...ctx,
    toHit: stepRoll,
    accuracy: stepAccuracy,
    damage: damageInstance,
  };
};

export const applyDamage = (ctx: ActionCtx) => {
  const { characters, damage, messages, mitigation } = ctx;

  mitigation.forEach((mitigationFactor, charId) => {
    /* Total threshold for attacker to hit */
    const revisedAccuracy = ctx.accuracy - mitigationFactor.evasion;

    if (ctx.toHit > revisedAccuracy) {
      messages.steps?.push(`Missed ${characters[charId].name}.`);
    } else {
      const character = characters[charId];
      const reducedDamage = limitToZero(damage - mitigationFactor.reduction);
      if (character?.stats?.life) {
        character.stats.life -= reducedDamage;
      }

      messages.steps?.push(
        `Hit ${characters[charId].name} for ${reducedDamage} damage (${damage} - ${mitigationFactor.reduction}).`,
      );
    }
  });

  return ctx;
};
