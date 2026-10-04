import { DamageType } from "../../types/equipables/maneuvers.ts";
import { WeaponType } from "../../types/equipables/weapons.ts";
import { StatsType } from "../../types/individual/stats.ts";
import { randNum } from "../../shared/utils.ts";

/**
 * Shared weapon-based value scaling, used by both damage and healing
 * calculations so any step that draws its power from the equipped weapon
 * (dealing damage, restoring life, etc.) scales identically.
 */
const createSpread = (spread: number) => randNum(spread * 2) - spread;

export function getBaseWeaponValue(weapon: WeaponType) {
  return weapon.power + createSpread(weapon.spread);
}

export function getModifiedWeaponValue(
  weapon: WeaponType,
  type: DamageType,
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

  switch (type) {
    case "bladed":
      return mrAff * stats.discipline.martial + bldAff * stats.mastery.bladed;
    case "blunt":
      return mrAff * stats.discipline.martial + bltAff * stats.mastery.blunt;
    case "elemental":
      return msAff * stats.discipline.mystic + eleAff * stats.mastery.elemental;
    case "psychic":
      return msAff * stats.discipline.mystic + psyAff * stats.mastery.psychic;
    default:
      return 0;
  }
}
