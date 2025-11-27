import { MnvOrTctFnType } from "../../../../types/events/turn.ts";
import { tacticCollection } from "../collection.ts";
import {
  calcRawEnemyDamage,
  calcRawMitigation,
  limitToZero,
  trunc,
} from "../../../turn/utils/battle.ts";

export function bonkFn({ characters, sourceId, targetIds }: MnvOrTctFnType) {
  const tctDetail = tacticCollection.find((tactic) => tactic.name === "bonk");
  const source = characters.enemies[sourceId];
  const targets = targetIds.map((targetId) => characters.players[targetId]);

  // Handle error
  if (!tctDetail) {
    return {
      characterResults: characters,
      logResults: [`ERROR HANDLING BONK`],
    };
  }

  const raw = tctDetail.steps?.map((action) => {
    const baseDamage = calcRawEnemyDamage(
      source.base || 0,
      source.stats,
      action.damageType,
    );
    const adjustedDamage = baseDamage * action.strength;

    return {
      damage: adjustedDamage,
      mitigation: targets.map((target) =>
        calcRawMitigation(target.stats, action.damageType),
      ),
    };
  });

  source.stats.speed -= tctDetail.speedCost;

  if (raw) {
    targets.forEach((target, index) => {
      target.stats.life -= limitToZero(
        trunc(
          raw.reduce(
            (total, rawEntry) =>
              total + (rawEntry.damage - rawEntry.mitigation[index]),
            0,
          ),
        ),
      );
    });
  }

  const logMessages: string[] = [""];

  const characterResponse = {
    players: {
      ...characters.players,
    },
    enemies: {
      ...characters.enemies,
      [sourceId]: source,
    },
  };

  return {
    characterResults: characterResponse,
    logResults: logMessages,
  };
}
