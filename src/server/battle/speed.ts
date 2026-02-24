import { ActionCtx } from "../../types/events/actionCtx.ts";
import { BattleType, GameType } from "../../types/game.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";

export const expendSpeed = (ctx: ActionCtx): ActionCtx => {
  const { characters, sourceId } = ctx;
  const source = characters[sourceId];

  if (!source) {
    return ctx;
  }

  source.stats.speed -= ctx.speed;
  ctx.characters[sourceId] = source;
  return {
    ...ctx,
    characters,
  };
};

export const finishTurn = (game: GameType) => {
  if (!game.characters) {
    return game;
  }

  const charactersIter = Object.values(game.characters);
  const isRoundEnd = Array.from(charactersIter).every(
    (character) => character.stats.speed <= 0,
  );

  return {
    ...game,
    battle: {
      ...(game.battle as BattleType),
      round: isRoundEnd ? game.battle!.round : game.battle!.round + 1,
      turnOrder: resolveTurnOrder(game.characters),
    },
  };
};
