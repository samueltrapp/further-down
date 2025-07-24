import { GameType, TurnType } from "../../types/game.ts";
import { slapOther, slapSelf } from "./maneuvers/slap.ts";
import { calcRawDamage, findCharacter } from "./utils/combatUtils.ts";
import {
  ManeuverName,
  ManeuverType,
  OtherManeuverFnType,
  SelfManeuverFnType,
} from "../../types/maneuvers.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import { maneuvers } from "./mnvDetails.ts";

type StatEffects = {
  other: OtherManeuverFnType;
  self: SelfManeuverFnType;
};

const maneuverMap = new Map<ManeuverName, StatEffects>();
maneuverMap.set("slap", { other: slapOther, self: slapSelf });

export function resolveTurn(turn: TurnType, game: GameType): GameType {
  const { maneuver } = turn;
  const maneuverFns = maneuverMap.get(maneuver) as StatEffects;
  const maneuverDetails = maneuvers[maneuver];
  return alterStats(game, turn, maneuverFns, maneuverDetails);
}

export function alterStats(
  game: GameType,
  turn: TurnType,
  maneuverFns: StatEffects,
  maneuverDetails: ManeuverType,
): GameType {
  const { issuerId, targetIds } = turn;
  const characters = game.characters;

  // Find attacker's stats
  const [actor, actorId] = findCharacter(characters, issuerId);
  for (const action of maneuverDetails.actions) {
    const rawDamage = calcRawDamage(actor.stats, action.damageType);
    const modifiedDamage = rawDamage * action.strength;

    // Find defenders' stats
    const recipients = targetIds.map((targetId) =>
      findCharacter(characters, targetId),
    );
    recipients.forEach((receivingChar) => {
      const recipient = receivingChar[0];
      const recipientId = receivingChar[1];
      characters[recipientId] = {
        ...characters[recipientId],
        stats: maneuverFns.other(recipient.stats, {
          damage: modifiedDamage,
          damageType: action.damageType,
        }),
      };
    });
  }

  characters[actorId] = {
    ...game.characters[actorId],
    lastTurn: game.turnNumber,
    stats: maneuverFns.self(actor.stats, maneuverDetails.speedCost),
  };

  return {
    ...game,
    characters: characters,
    turnNumber: game.turnNumber + 1,
    turnOrder: resolveTurnOrder(characters),
  };
}
