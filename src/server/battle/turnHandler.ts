import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { applyDamage, calcDamage } from "./damage.ts";
import { calcMitigation } from "./mitigation.ts";
import { expendSpeed } from "./speed.ts";
import { sendGame } from "../meta/gameManagement.ts";
import { Victor } from "../../types/game.ts";
import { applyDeath, checkNextTurn, finishTurn, switchWeapon } from "./core.ts";
import { toCaps } from "../../client/utils/formatting.ts";
import { TeamType } from "../../types/individual/characters.ts";
import { randEntry, validTargets } from "../../shared/utils.ts";
import { applyEffect } from "./effect.ts";

type TurnProps = {
  sourceTeam: TeamType;
  targetIds: string[];
};

const assignTargets = (ctx: ActionCtx, turnProps: TurnProps) => {
  const { sourceTeam, targetIds } = turnProps;
  const { characters, maneuver } = ctx;

  switch (maneuver.targetMethod) {
    case "select":
      return targetIds;
    case "self":
      return [ctx.sourceId];
    case "all":
      return validTargets(characters, sourceTeam, maneuver.perspective);
    case "random":
      return [
        randEntry(validTargets(characters, sourceTeam, maneuver.perspective))
          .pick,
      ] as string[];
    default:
      return [];
  }
};

const resetCtxStep = (ctx: ActionCtx, turnProps: TurnProps): ActionCtx => {
  return {
    ...ctx,
    targetIds: assignTargets(ctx, turnProps),
    toHit: 0,
    accuracy: 0,
    instance: new Map(),
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
    const maneuver = maneuverMap.get(turn.maneuver);

    if (!source || !maneuver || !game.battle) {
      return;
    }

    const sourceTeam = turn.team;
    const weapon = sourceTeam === "player" ? turn.weapon : "";

    let ctx: ActionCtx = {
      characters: game.characters,
      sourceId: turn.sourceId,
      maneuver: maneuver,
      targetIds: [],
      speed: maneuver.speedCost,
      messages: turnLog(source.name, maneuver.name, weapon),
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
    };

    /* Pre-action */
    if (isPlayerTurn) {
      ctx = switchWeapon(ctx, turn.weapon);
    }

    /* Action */
    maneuver?.steps.forEach((step) => {
      ctx = resetCtxStep(ctx, { sourceTeam, targetIds: turn.targetIds });

      if (step.type === "hit") {
        ctx = calcDamage(step, ctx);
        if (step.customHitFn) {
          ctx = step.customHitFn(ctx);
        }
        ctx = calcMitigation(step, ctx);
        ctx = applyDamage(ctx);
      } else if (step.type === "heal") {
        ctx = { ...ctx };
      } else if (step.type === "effect") {
        ctx = applyEffect(step, ctx);
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
