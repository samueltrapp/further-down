import {
  OtherManeuverFnArgsType,
  SelfManeuverFnArgsType,
} from "../../../../types/equipables/maneuvers.ts";
import {
  calcRawDamage,
  calcRawMitigation,
  limitToZero,
  trunc,
} from "../../../turn/utils/battle.ts";
import { details } from "../details.ts";
import { WeaponType } from "../../../../types/equipables/weapons.ts";

export function quicksilverOther(fnArgs: OtherManeuverFnArgsType) {
  const { actor, recipient, maneuver, weapon: weaponName } = fnArgs;
  const mnvDetail = details[maneuver];

  const weapon = actor.weapons.find(
    (weapon) => weapon.name === weaponName,
  ) as WeaponType;

  const raw = mnvDetail.actions.map((action) => ({
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

export function quicksilverSelf(fnArgs: SelfManeuverFnArgsType) {
  const { self, maneuver } = fnArgs;
  const mnvDetail = details[maneuver];
  const updatedSpeed = self.stats.speed - mnvDetail.speedCost;

  return {
    character: {
      ...self,
      stats: {
        ...self.stats,
        speed: updatedSpeed,
      },
    },
  };
}
