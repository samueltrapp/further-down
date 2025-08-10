import { StatsType } from "../../../types/individual/stats.ts";
import { CharType } from "../../../types/individual/characters.ts";
import { WeaponType } from "../../../types/equipables/weapons.ts";
import { DamageType } from "../../../types/turns.ts";

const createSpread = (spread: number) => {
  const rand = Math.random();
  return (Math.floor(rand * 10) % 2 === 0 ? 1 : -1) * Math.round(rand * spread);
};

export const findCharacter = (
  characters: CharType[],
  charId: string,
): [CharType, number] => {
  const attackerId = characters.findIndex(
    (character) => character.id === charId,
  );
  const attacker = characters[attackerId];
  return [attacker, attackerId];
};

export const calcRawDamage = (
  weapon: WeaponType,
  stats: StatsType,
  damageType: DamageType,
) => {
  const baseDamage = weapon.power + createSpread(weapon.spread);
  const {
    physical: phAff,
    magical: mgAff,
    bladed: bldAff,
    blunt: bltAff,
    elemental: eleAff,
    psychic: psyAff,
  } = weapon.affinities;

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

export const calcRawMitigation = (stats: StatsType, damageType: DamageType) => {
  switch (damageType) {
    case "blunt":
      return stats.defense + stats.plating;
    case "bladed":
      return stats.defense + stats.padding;
    case "elemental":
      return stats.resistance + stats.dampening;
    case "psychic":
      return stats.resistance + stats.warding;
    default:
      return 0;
  }
};

export const limitToZero = (value: number) => Math.max(value, 0);
export const trunc = (value: number) => Math.trunc(value);
