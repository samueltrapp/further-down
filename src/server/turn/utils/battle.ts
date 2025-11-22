import { StatsType } from "../../../types/individual/stats.ts";
import { WeaponType } from "../../../types/equipables/weapons.ts";
import { DamageType } from "../../../types/events/turn.ts";
import { randNum } from "../../../common/utils.ts";

const createSpread = (spread: number) => randNum(spread * 2) - spread;

export const calcRawPlayerDamage = (
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

export const calcRawEnemyDamage = (
  base: number,
  stats: StatsType,
  damageType: DamageType,
) => {
  switch (damageType) {
    case "bladed":
      return base + stats.bladed;
    case "blunt":
      return base + stats.blunt;
    case "elemental":
      return base + stats.elemental;
    case "psychic":
      return base + stats.psychic;
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

export const limitToZero = (value: number | undefined) =>
  value ? Math.max(value, 0) : 0;
export const trunc = (value: number) => Math.trunc(value);
