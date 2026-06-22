import { ActionCtx } from "../../types/events/actionCtx.ts";

/**
 * Prevent values from exceeding a maximum value.
 *
 * @param value
 * @param max
 */
export const limitToMax = (value: number, max: number) => Math.min(value, max);

/**
 * Prevent values from going negative.
 *
 * @param value
 */
export const limitToZero = (value: number) => Math.max(value, 0);

/**
 * Prevents values from going outside the bounds of 0 and a max.
 *
 * @param value
 * @param max
 */
export const limitToBounds = (value: number, max: number) =>
  limitToZero(limitToMax(value, max));

/**
 * Truncates numbers to integers.
 *
 * @param value
 */
export const trunc = (value: number) => Math.trunc(value);

/**
 * Extracts successful hits from the action context.
 *
 * @param ctx - The action context containing damage instance data
 * @returns Array of {targetId, actualDamage} for all successful hits
 */
export const extractSuccessfulHits = (ctx: ActionCtx) => {
  const hits: Array<{ targetId: string; damage: number }> = [];

  ctx.instance.forEach((instanceDtl, targetId) => {
    if (!instanceDtl.evaded) {
      hits.push({ targetId, damage: instanceDtl.damage });
    }
  });

  return hits;
};
