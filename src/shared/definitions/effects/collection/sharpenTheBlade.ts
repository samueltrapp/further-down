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

  return ctx;
};

const removeFn = (ctx: ActionCtx, sourceId: string) => {
  const { characters } = ctx;
  /* Called once per expired stack; reduces one bladed point per call */
  if ((characters[sourceId].effects["sharpen the blade"]?.value ?? 0) > 0) {
    characters[sourceId].stats.mastery.bladed -= 1;
  }

  return ctx;
};

const sharpenTheBlade: EffectType = {
  type: "favor",
  durationType: "rounds",
  stackable: true,
  tooltip:
    "Gain 1 BLD every time you hit with a BLD maneuver. Lasts until end of round.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default sharpenTheBlade;
