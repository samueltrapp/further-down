import {
  calcRawDamage,
  calcRawMitigation,
  limitToZero,
  trunc,
} from "../../../turn/utils/battle.ts";
import {
  OtherManeuverFnArgsType,
} from "../../../../types/equipables/maneuvers.ts";
import { WeaponType } from "../../../../types/equipables/weapons.ts";
import { maneuverCollection } from "../collection.ts";

export function slapFn(fnArgs: OtherManeuverFnArgsType) {
  const { actor, recipient, maneuver, weapon: weaponName } = fnArgs;
  const mnvDetail = maneuverCollection[maneuver];

  const weapon = actor.rewards.owned.weapons.find(
    (weapon) => weapon.name === weaponName,
  ) as WeaponType;

  const raw = mnvDetail!.steps!.map((action) => ({
    damage:
      calcRawDamage(weapon, actor.stats, action.damageType) * action.strength,
    mitigation: calcRawMitigation(actor.stats, action.damageType),
  }));
  const mitigatedDamage = limitToZero(
    raw.reduce(
      (total, rawEntry) => total + (rawEntry.damage - rawEntry.mitigation),
      0,
    ),
  );
  const updatedHp = limitToZero(
    trunc(recipient.stats.hitPoints - mitigatedDamage),
  );

  const logMessages = [
    `${actor.name.toUpperCase()} hit ${recipient.name.toUpperCase()} with ${maneuver.toUpperCase()} for ${mitigatedDamage} damage!}
  (${recipient.stats.hitPoints} -> ${updatedHp})`,
  ];

  return {
    character: {
      ...recipient,
      stats: {
        ...recipient.stats,
        hitPoints: updatedHp,
      },
    },
    logMessages,
  };
}
