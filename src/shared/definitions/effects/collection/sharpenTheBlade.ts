import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { StepType } from "../../../../types/equipables/maneuvers.ts";

const applyFn = (ctx: ActionCtx, ids: string[], step: StepType | undefined) => {
  if (step?.type === "hit" && step.damageType !== "bladed") {
    return ctx;
  }

  const id = ids[0];
  const { characters } = ctx;

  let hit = false;
  for (const instance of ctx.instance) {
    if (!instance[1].evaded) {
      hit = true;
      break;
    }
  }

  if (hit) {
    characters[id].stats.mastery.bladed += 1;
  }

  return ctx;
};

const removeFn = (ctx: ActionCtx, ids: string[]) => {
  const { characters } = ctx;
  ids.forEach((id) => {
    const stacks = characters[id].effects["sharpen the blade"] || 0;
    characters[id].effects["sharpen the blade"] = 0;
    characters[id].stats.mastery.bladed -= stacks;
  });

  return ctx;
};

const sharpenTheBlade: EffectType = {
  type: "favor",
  duration: "round",
  stackable: true,
  tooltip:
    "Gain 1 BLD every time you hit with a BLD maneuver. Lasts until end of round.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default sharpenTheBlade;
