import { ActionCtx } from "../../types/events/actionCtx.ts";
import { blessingMap } from "../../shared/definitions/blessings/sets.ts";
import { BlessingActivation } from "../../types/equipables/blessings.ts";
import { validTargets } from "../../shared/utils.ts";

export const handleBlessings = (
  ctx: ActionCtx,
  activation: BlessingActivation,
): ActionCtx => {
  const source = ctx.characters[ctx.sourceId];
  if (!source) return ctx;

  const targetIds = validTargets(ctx.characters, source.team, "other");

  (source.equipped.blessings ?? []).forEach((blessingName) => {
    const blessing = blessingMap.get(blessingName);
    if (blessing?.trigger === activation && blessing.onTrigger) {
      ctx = blessing.onTrigger(ctx, targetIds);
    }
  });

  return ctx;
};

