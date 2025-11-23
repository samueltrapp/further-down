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

  // Calc damage and mitigation per step
  const raw = mnvDetail.steps?.map((action) => {
    const baseDamage = calcRawPlayerDamage(
      weapon,
      source.stats,
      action.damageType,
    );
    const verveBonus = (source.effects.favors?.verve?.stacks || 0) * 5;
    const adjustedDamage = (baseDamage + verveBonus) * action.strength;

    return {
      damage: adjustedDamage,
      mitigation: targets.map((target) =>
        calcRawMitigation(target.stats, action.damageType),
      ),
    };
  });

  // Increase verve stack
  // TODO: Move Verve logic to be general
  source.effects.favors.verve = source.effects.favors.verve
    ? {
        ...source.effects.favors.verve,
        stacks: source.effects.favors.verve.stacks + 1,
      }
    : {
        stacks: 1,
        trigger: "turn",
        duration: "battle",
        tooltip: "VERVE: Empowers psychic effects",
      };

  if (raw) {
    targets.forEach((target, index) => {
      target.stats.hitPoints -= limitToZero(
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

  const logMessages = [
    `${source.name.toUpperCase()} hit ${targets[0].name.toUpperCase()} with ACHE`,
  ];

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
