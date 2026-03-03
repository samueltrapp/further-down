import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { applyDamage, calcDamage } from "../battle/damage.ts";
import { calcMitigation } from "../battle/mitigation.ts";
import { expendSpeed } from "../battle/speed.ts";
import { sendGame } from "./gameManagement.ts";
import { Victor } from "../../types/game.ts";
import {
  applyDeath,
  checkNextTurn,
  finishTurn,
  switchWeapon,
} from "../battle/core.ts";
import { tacticMap } from "../../shared/definitions/tactics/sets.ts";

const resetCtxStep = (ctx: ActionCtx): ActionCtx => {
  return {
    ...ctx,
    toHit: 0,
    accuracy: 0,
    damage: 0,
    mitigation: new Map(),
    heal: 0,
  };
};

export function handleTurn(
  connection: ConnectionType,
  turn: PlayerTurnType | EnemyTurnType,
) {
  const game = connection.meta.games.get(turn.gameId);
  if (game && game.characters) {
    const source = game.characters[turn.sourceId];
    const isPlayerTurn = turn.team === "player";
    const action = isPlayerTurn
      ? maneuverMap.get(turn.maneuver)
      : tacticMap.get(turn.tactic);

    if (!source || !action || !game.battle) {
      return; // TODO: Better error handling
    }

    let ctx: ActionCtx = {
      characters: game.characters,
      sourceId: turn.sourceId,
      playerTargetIds: turn.playerTargetIds,
      enemyTargetIds: turn.enemyTargetIds,
      actionName: action.name,
      speed: action.speedCost,
      messages: game.battle.messages,
      toHit: 0,
      accuracy: 0,
      damage: 0,
      mitigation: new Map(),
      heal: 0,
    };

    /* Pre-action */
    if (isPlayerTurn) {
      ctx = switchWeapon(ctx, turn.weapon);
    }

    /* Action */
    action?.steps.forEach((step) => {
      ctx = resetCtxStep(ctx);

      if (step.type === "hit") {
        ctx = calcDamage(step, ctx);
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
    ctx = applyDeath(ctx);

    const updatedGame = finishTurn(game, ctx.characters, ctx.messages);
    connection.meta.games.set(turn.gameId, updatedGame);
    sendGame(connection, turn.gameId);

    /* Automatically take enemy turn if applicable */
    if (updatedGame.battle?.victor === Victor.NONE) {
      checkNextTurn(connection, turn.gameId);
    }
  }
}
