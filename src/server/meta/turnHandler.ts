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
import { TeamType } from "../../types/individual/characters.ts";
import { randEntry, validTargets } from "../../shared/utils.ts";

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
  console.debug(`TURN: ${game?.characters?.[turn.sourceId].name}`);
  if (game && game.characters) {
    const source = game.characters[turn.sourceId];
    const isPlayerTurn = turn.team === "player";
    const maneuver = maneuverMap.get(turn.maneuver);

    console.debug(turn);
    console.debug(source);
    console.debug(maneuver);
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
      damage: 0,
      mitigation: new Map(),
      heal: 0,
    };

    /* Pre-action */
    if (isPlayerTurn) {
      ctx = switchWeapon(ctx, turn.weapon);
    }

    /* Action */
    maneuver?.steps.forEach((step, index) => {
      console.debug(`STEP: ${index}`);
      ctx = resetCtxStep(ctx, { sourceTeam, targetIds: turn.targetIds });
      console.debug(`TARGETS: ${ctx.targetIds}`);

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
