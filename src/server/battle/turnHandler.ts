import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";
import { ConnectionType } from "../../types/server.ts";
import { maneuverMap } from "../../shared/definitions/maneuvers/sets.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { applyDamage, handleAttack } from "./damage.ts";
import { calcEvasion, handleMitigation } from "./mitigation.ts";
import { expendSpeed, restoreSpeed } from "./speed.ts";
import { sendGame } from "../meta/gameManagement.ts";
import { Victor } from "../../types/game.ts";
import {
  applyDeath,
  checkNextTurn,
  checkProgressStatus,
  finishTurn,
  switchWeapon,
} from "./core.ts";
import { toCaps } from "../../client/utils/formatting.ts";
import { TeamType } from "../../types/individual/characters.ts";
import { randEntry, validTargets } from "../../shared/utils.ts";
import { applyEffect, removeEffects } from "./effect.ts";
import { processBurnDamage } from "./burn.ts";
import { processBleedDamage } from "./bleed.ts";
import { handleSideEffects } from "./sideEffects.ts";

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
  const targetIds = assignTargets(ctx, turnProps);
  const instance = new Map(
    targetIds.map((targetId) => [
      targetId,
      { damage: 0, mitigation: 0, heal: 0, evaded: false },
    ]),
  );

  return {
    ...ctx,
    targetIds,
    toHit: 0,
    accuracy: 0,
    instance,
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
    const isBattleStart = game.battle.isFresh;

    let ctx: ActionCtx = {
      characters: game.characters,
      sourceId: turn.sourceId,
      maneuver: maneuver,
      targetIds: [],
      speed: maneuver.speedCost,
      speedElapsed: game.battle.speedElapsed,
      messages: turnLog(source.name, maneuver.name, weapon),
      toHit: 0,
      accuracy: 0,
      instance: new Map(),
      heal: 0,
      round: game.battle.round,
    };

    /* Pre-action */
    if (isPlayerTurn) {
      ctx = switchWeapon(ctx, turn.weapon);
    }

    /* Battle-start and round-start side effects only trigger on the very first turn of a fresh battle. */
    if (isBattleStart) {
      ctx = handleSideEffects(ctx, "battle-start");
      ctx = handleSideEffects(ctx, "round-start");
    }

    /* Turn-start blessings and enchantments, apply burn damage */
    ctx = handleSideEffects(ctx, "turn-start");
    ctx = processBurnDamage(ctx);
    ctx = applyDeath(ctx);

    const isDead = ctx.characters[ctx.sourceId]?.isDead;

    /* Action */
    if (!isDead) {
      maneuver?.steps.forEach((step) => {
        ctx = resetCtxStep(ctx, { sourceTeam, targetIds: turn.targetIds });

        /* Process hits */
        if (step.type === "hit") {
          ctx = handleAttack(ctx, step);
          if (step.hitFn) {
            ctx = step.hitFn(ctx);
          }
          ctx = calcEvasion(step, ctx);
          ctx = handleSideEffects(ctx, "attack", step);
          ctx = handleMitigation(ctx, step);
          ctx = handleSideEffects(ctx, "defend", step);
          ctx = applyDamage(ctx);
        } else if (step.type === "heal") {
          /* Process healing */
          ctx = { ...ctx };
        } else if (step.type === "effect") {
          /* Process effects */
          ctx = applyEffect(
            ctx,
            ctx.sourceId,
            ctx.targetIds,
            step.effect,
            step.stacks,
          );
        }
      });
    }

    /* Post-action */
    ctx = expendSpeed(ctx);
    ctx = processBleedDamage(ctx);
    ctx = applyDeath(ctx);
    game.battle.speedElapsed += ctx.speed;

    const { isRoundEnd, victor } = checkProgressStatus(ctx);

    /* End of turn */
    ctx = handleSideEffects(ctx, "turn-end");
    ctx = removeEffects(ctx, "turns");

    /* End of round */
    if (isRoundEnd) {
      ctx = handleSideEffects(ctx, "round-end");
      ctx = removeEffects(ctx, "rounds");
      ctx = restoreSpeed(ctx);
      ctx = handleSideEffects(ctx, "round-start");
    }

    ctx = applyDeath(ctx);

    /* End of battle */
    if (victor !== Victor.NONE) {
      ctx = handleSideEffects(ctx, "battle-end");
      ctx = removeEffects(ctx, "battle");
    }

    const updatedGame = finishTurn(
      game,
      ctx.characters,
      isRoundEnd,
      ctx.messages,
      victor,
    );
    connection.meta.games.set(turn.gameId, updatedGame);
    sendGame(connection, turn.gameId);

    /* Automatically take enemy turn if applicable */
    if (updatedGame.battle?.victor === Victor.NONE) {
      checkNextTurn(connection, turn.gameId);
    }
  }
}
