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
import { toCaps } from "../../client/utils/formatting.ts";

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

const turnLog = (
  sourceName: string,
  actionName: string,
  weaponName: string | undefined,
) => {
  const weaponClause = weaponName ? ` (${toCaps(weaponName)})` : "";
  return {
    headline: `${sourceName} used ${toCaps(actionName)}${weaponClause}.`,
    steps: [],
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
    const action = maneuverMap.get(turn.maneuver);

    if (!source || !action || !game.battle) {
      return;
    }

    const weapon = turn.team === "player" ? turn.weapon : undefined;

    let ctx: ActionCtx = {
      characters: game.characters,
      sourceId: turn.sourceId,
      targetIds: turn.targetIds,
      maneuverName: action.name,
      speed: action.speedCost,
      messages: turnLog(source.name, action.name, weapon),
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
