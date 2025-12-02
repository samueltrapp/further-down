import {
  calcRawMitigation,
  calcRawPlayerDamage,
  limitToZero,
  trunc,
} from "../../../turn/utils/battle.ts";
import { maneuverCollection } from "../collection.ts";
import { MnvOrTctFnType } from "../../../../types/events/turn.ts";

export function acheFn({ characters, sourceId, targetIds }: MnvOrTctFnType) {
  const mnvDetail = maneuverCollection.find(
    (maneuver) => maneuver.name === "ache",
  );
  const source = characters.players[sourceId];
  const targets = targetIds.map((targetId) => characters.enemies[targetId]);
  const weapon = source.rewards.owned.weapons[0];

  if (!mnvDetail) {
    return {
      characterResults: characters,
      logResults: ["ERROR HANDLING ACHE"],
    };
  }

  const logMessages: string[] = [];

  // Modify source
  source.stats.speed -= mnvDetail.speedCost;

  // Modify targets
  targets.forEach((target) => {
    mnvDetail.steps?.forEach((action) => {
      /* Damage */
      const baseDamage = calcRawPlayerDamage(
        weapon,
        source.stats,
        action.damageType,
      );
      const anguishBonus = (target.effects.burdens?.anguish?.stacks || 0) * 5;
      const damageMitigation = calcRawMitigation(
        target.stats,
        action.damageType,
      );
      const modifiedDamage = (baseDamage + anguishBonus) * action.strength;
      const damage = trunc(modifiedDamage - damageMitigation);
      const newLife = limitToZero(target.stats.life - damage);
      logMessages.push(
        `${source.name.toUpperCase()} hit ${target.name.toUpperCase()} with ACHE for ${damage} ${action.damageType.toUpperCase()} DAMAGE (${target.stats.life} -> ${newLife}).`,
      );
      target.stats.life = newLife;

      /* Burden */
      const previousAnguish = target.effects.burdens?.anguish?.stacks || 0;
      if (target.effects.burdens.anguish) {
        target.effects.burdens.anguish.stacks = previousAnguish + 1;
      } else {
        target.effects.burdens.anguish = {
          stacks: 1,
          trigger: "turn",
          duration: "battle",
          tooltip: "VERVE: Empowers psychic effects",
        };
      }
      logMessages.push(
        `${source.name.toUpperCase()} applied ANGUISH to ${target.name.toUpperCase()} with ACHE (${previousAnguish} -> ${target.effects.burdens.anguish.stacks}).`,
      );
    });
  });

  const characterResponse = {
    players: {
      ...characters.players,
      [sourceId]: source,
    },
    enemies: {
      ...characters.enemies,
    },
  };

  return {
    characterResults: characterResponse,
    logResults: logMessages,
  };
}
