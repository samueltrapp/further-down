import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const applyFn = (ctx: ActionCtx, sourceId: string) => {
  const { characters } = ctx;

  let hit = false;
  for (const instance of ctx.instance) {
    const instanceDtl = instance[1];
    if (!instanceDtl.evaded) {
      hit = true;
      break;
    }
  }

  if (hit) {
    characters[sourceId].stats.mastery.bladed += 1;
  }

  return { ctx, value: hit ? 1 : 0 };
};

const removeFn = (
  ctx: ActionCtx,
  sourceId: string,
  _targetId: string,
  value: number,
) => {
  const { characters } = ctx;
  /* Reverses the recorded bladed gain directly, instead of recalculating it. */
  characters[sourceId].stats.mastery.bladed -= value;

  return ctx;
};

const sharpenTheBlade: EffectType = {
  type: "favor",
  durationType: "rounds",
  stackType: "escalate",
  tooltip: "Gain 1 BLD every time you hit. Lasts until end of round.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default sharpenTheBlade;
