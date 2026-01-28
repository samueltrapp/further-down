import { ActionCtx } from "../../../types/events/actionCtx.ts";
import { BattleType, GameType } from "../../../types/game.ts";
import { resolveTurnOrder } from "../../../server/utils/turnOrder.ts";

export const expendSpeed = (ctx: ActionCtx): ActionCtx => {
  const { characters, sourceId } = ctx;
  const source = characters.get(sourceId);

  if (!source) {
    return ctx;
  }

  source.stats.speed -= ctx.speed;
  ctx.characters.set(sourceId, source);
  return {
    ...ctx,
    characters,
  };
};

export const finishTurn = (game: GameType) => {
  const charactersIter = game.characters.values();
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
