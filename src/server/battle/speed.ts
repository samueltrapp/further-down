import { ActionCtx } from "../../types/events/actionCtx.ts";
import { CharactersType } from "../../types/game.ts";

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

export const restoreSpeed = (characters: CharactersType) => {
  Array.from(Object.values(characters)).forEach((character) => {
    characters[character.id].stats.speed += character.stats.maxSpeed;
  });
  return characters;
};
