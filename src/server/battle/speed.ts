import { ActionCtx } from "../../types/events/actionCtx.ts";

export const expendSpeed = (ctx: ActionCtx): ActionCtx => {
  const { characters, sourceId } = ctx;
  const source = characters[sourceId];

  if (!source) {
    return ctx;
  }

  source.stats.core.speed -= ctx.speed;
  ctx.characters[sourceId] = source;
  return {
    ...ctx,
    characters,
  };
};

export const restoreSpeed = (ctx: ActionCtx) => {
  const { characters } = ctx;
  for (const characterId in characters) {
    const character = characters[characterId];
    character.stats.core.speed += character.stats.core.maxSpeed;
  }

  return {
    ...ctx,
    characters,
  };
};
