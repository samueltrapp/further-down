import {
  calcRawMitigation,
  calcRawPlayerDamage,
  limitToZero,
  trunc,
} from "../../../turn/utils/battle.ts";
import { maneuverCollection } from "../collection.ts";
import { MnvOrTctFnType } from "../../../../types/events/turn.ts";

export function quicksilverFn({
  characters,
  sourceId,
  targetIds,
}: MnvOrTctFnType) {
  const mnvDetail = maneuverCollection.find(
    (maneuver) => maneuver.name === "quicksilver",
  );
  const source = characters.players[sourceId];
  const targets = targetIds.map((targetId) => characters.enemies[targetId]);
  const weapon = source.rewards.owned.weapons[0];

  if (!mnvDetail) {
    return {
      characterResults: characters,
      logResults: ["ERROR HANDLING QUICKSILVER"],
    };
  }

  const logMessages: string[] = [];

  /* Speed */
  source.stats.speed -= mnvDetail.speedCost;

  mnvDetail.steps?.forEach((action) => {
    /* Damage */
    const baseDamage = calcRawPlayerDamage(
      weapon,
      source.stats,
      action.damageType,
    );

    targets.forEach((target) => {
      const damageMitigation = calcRawMitigation(
        target.stats,
        action.damageType,
      );
      const modifiedDamage = baseDamage * action.strength;
      const damage = trunc(modifiedDamage - damageMitigation);
      const newLife = limitToZero(target.stats.life - damage);
      logMessages.push(
        `${source.name.toUpperCase()} hit ${target.name.toUpperCase()} with QUICKSILVER for ${damage} ${action.damageType.toUpperCase()} DAMAGE (${target.stats.life} -> ${newLife}).`,
      );
      target.stats.life = newLife;
    });
  });

  return {
    characterResults: characters,
    logResults: logMessages,
  };
}
