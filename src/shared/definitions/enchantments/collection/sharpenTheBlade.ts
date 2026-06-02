import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { StepType } from "../../../../types/equipables/maneuvers.ts";
import { EnchantmentType } from "../../../../types/equipables/enchantments.ts";

const triggerFn = (
  ctx: ActionCtx,
  ids: string[],
  step: StepType | undefined,
) => {
  if (step?.type === "hit" && step.damageType !== "bladed") {
    return ctx;
  }

  const id = ids[0];
  const { characters } = ctx;
  const currentStat = characters[id]?.effects.favors["sharpen the blade"];

  let hit = false;
  for (const instance of ctx.instance) {
    if (!instance[1].evaded) {
      hit = true;
      break;
    }
  }

  if (hit) {
    characters[id].effects.favors["sharpen the blade"] = currentStat
      ? currentStat + 1
      : 1;
    characters[id].stats.bladed += 1;
  }

  return ctx;
};

const expireFn = (ctx: ActionCtx, ids: string[]) => {
  const { characters } = ctx;
  ids.forEach((id) => {
    const stacks = characters[id].effects.favors["sharpen the blade"] || 0;
    characters[id].effects.favors["sharpen the blade"] = 0;
    characters[id].stats.bladed -= stacks;
  });

  return ctx;
};

export const sharpenTheBladeEnch: EnchantmentType = {
  name: "sharpen the blade",
  description:
    "Each hit with BLD damage increases your BLD by 1 until the end of the round.",
  trigger: "attack",
  expiration: "round-end",
  onTrigger: (ctx, ids, step) => triggerFn(ctx, ids, step),
  onExpire: (ctx, ids) => expireFn(ctx, ids),
  priority: 0,
};
