import { HitStep } from "../../../types/equipables/actions.ts";
import { ActionCtx } from "../../../types/events/actionCtx.ts";
import { randNum } from "../../../common/utils.ts";
import { limitToZero, trunc } from "../../../server/utils/battle.ts";
import { randomInt } from "node:crypto";
import { weaponMap } from "../weapons/sets.ts";
import { PlayerType } from "../../../types/individual/characters.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const calcDamage = (step: HitStep, ctx: ActionCtx) => {
  const { damageType, strength } = step;
  const { characters, sourceId } = ctx;
  const source = characters.get(sourceId) as PlayerType | undefined;
  const weaponName = source?.rewards.equippedWeapon;
  const weapon = weaponName && weaponMap.get(weaponName);
  if (!source || !weapon) {
    return ctx;
  }

  const stats = source.stats;
  const baseDamage = weapon.power + createSpread(weapon.spread);

  const {
    physical: phAff,
    magical: mgAff,
    bladed: bldAff,
    blunt: bltAff,
    elemental: eleAff,
    psychic: psyAff,
  } = weapon.affinities;

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
  const { characters, damage, mitigation } = ctx;

  mitigation.forEach((mitigationFactor, charId) => {
    /* Total threshold for attacker to hit */
    const revisedAccuracy = ctx.accuracy - mitigationFactor.evasion;

    console.log(`To hit: ${ctx.toHit}, accuracy: ${revisedAccuracy}`);
    if (ctx.toHit > revisedAccuracy) {
      // miss
    } else {
      const character = characters.get(charId);
      const reducedDamage = limitToZero(damage - mitigationFactor.reduction);
      console.log(`Damage: ${damage}, reduced damage: ${reducedDamage}`);

      if (character?.stats?.life) {
        character.stats.life -= reducedDamage;
      }
    }
  });

  return {
    ...ctx,
    characters,
  };
};
