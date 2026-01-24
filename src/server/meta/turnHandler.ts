import { PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { mnvFns } from "../lib/maneuvers/fnMap.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { ActionCtx } from "../turn/actions/actionCtx.ts";
import { applyDamage, calcDamage } from "../lib/maneuvers/damage.ts";
import { calcMitigation } from "../lib/maneuvers/mitigation.ts";

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
  if (game) {
    const source = game.characters.get(turn.sourceId) as PlayerType | undefined;
    const weapon = source?.rewards.owned.weapons.find(
      (weapon) => weapon.equipped,
    );

    if (!source || !weapon) {
      return;
    }

    let ctx: ActionCtx = {
      characters: { ...game.characters },
      sourceId: turn.sourceId,
      friendlyTargetIds: turn.friendlyTargetIds,
      enemyTargetIds: turn.enemyTargetIds,
      weapon,
      speed: 0,
      messages: [],
      toHit: 0,
      accuracy: 0,
      damage: 0,
      mitigation: new Map(),
      heal: 0,
    };

    const mnv = mnvFns.get(turn.maneuver);
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

    const updatedGame = {
      ...game,
      characters: ctx?.characters,
    };

    connection.meta.games.set(turn.gameId, updatedGame);
    // sendGame(connection, turn.gameId, logMessages);
  }
}
