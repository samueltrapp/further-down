import {
  calcRawDamage,
  calcRawMitigation,
  limitToZero,
  trunc,
} from "../utils/combatUtils.ts";
import { CharType } from "../../../types/characters.ts";
import { mnvDetails } from "../mnvDetails.ts";
import { ManeuverName } from "../../../types/maneuvers.ts";

export function slapOther(
  recipient: CharType,
  actor: CharType,
  maneuver: ManeuverName,
) {
  const mnvDetail = mnvDetails[maneuver];

  const raw = mnvDetail.actions.map((action) => ({
    damage: calcRawDamage(actor.stats, action.damageType) * action.strength,
    mitigation: calcRawMitigation(actor.stats, action.damageType),
  }));

  const logMessages = ["Other log"];
  const mitigatedDamage = limitToZero(
    raw.reduce(
      (acc, rawEntry) => acc + (rawEntry.damage - rawEntry.mitigation),
      0,
    ),
  );
  const updatedHp = limitToZero(
    trunc(recipient.stats.hitPoints - mitigatedDamage),
  );

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

export function slapSelf(self: CharType, maneuver: ManeuverName) {
  const mnvDetail = mnvDetails[maneuver];

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
