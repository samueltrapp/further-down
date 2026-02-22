import { PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import {
  applyDamage,
  calcDamage,
} from "../../shared/definitions/maneuvers/damage.ts";
import { calcMitigation } from "../../shared/definitions/maneuvers/mitigation.ts";
import {
  expendSpeed,
  finishTurn,
} from "../../shared/definitions/maneuvers/speed.ts";
import { sendGame } from "./gameManagement.ts";
import { GameType } from "../../types/game.ts";

const resetCtxStep = (ctx: ActionCtx): ActionCtx => {
  return {
    ...ctx,
    messages: [],
    toHit: 0,
    accuracy: 0,
    damage: 0,
    mitigation: new Map(),
    heal: 0,
  };
};

export function handleTurn(connection: ConnectionType, turn: PlayerTurnType) {
  const game = connection.meta.games.get(turn.gameId);
  if (game && game.characters) {
    const source = game.characters[turn.sourceId] as PlayerType | undefined;

    if (!source) {
      return;
    }

    source.rewards.equippedWeapon = turn.weapon;

    let ctx: ActionCtx = {
      characters: game.characters,
      sourceId: turn.sourceId,
      friendlyTargetIds: turn.friendlyTargetIds,
      enemyTargetIds: turn.enemyTargetIds,
      speed: maneuverMap.get(turn.maneuver)!.speedCost, //TODO: type
      messages: [],
      toHit: 0,
      accuracy: 0,
      damage: 0,
      mitigation: new Map(),
      heal: 0,
    };

    const mnv = maneuverMap.get(turn.maneuver);
    if (!mnv) {
      return;
    }

    /* Pre-action */

    /* Action */
    mnv?.steps.forEach((step) => {
      ctx = resetCtxStep(ctx);

      if (step.type === "hit") {
        ctx = calcDamage(step, ctx);
        // check evasion
        ctx = calcMitigation(step, ctx);

        ctx = applyDamage(ctx);
      } else if (step.type === "heal") {
        ctx = { ...ctx };
      } else if (step.type === "effect") {
        ctx = { ...ctx };
      }
      // on-hit
      // on-defend
    });

    /* Post-action */
    ctx = expendSpeed(ctx);

    let updatedGame: GameType = {
      ...game,
      characters: ctx?.characters,
    };

    updatedGame = finishTurn(updatedGame);

    connection.meta.games.set(turn.gameId, updatedGame);
    sendGame(connection, turn.gameId);
    // sendGame(connection, turn.gameId, logMessages);
  }
}
