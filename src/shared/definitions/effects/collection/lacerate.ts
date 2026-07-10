import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { EffectStep } from "../../../../types/equipables/maneuvers.ts";
import {
  applyBleedSource,
  removeBleedSource,
} from "../../../../server/battle/bleed.ts";

const FLAT_DAMAGE = 5;
const SCALING_DAMAGE = 1;

const applyFn: ApplyFnType = (ctx, sourceId, targetId, step) => {
  const stacks = (step as EffectStep | undefined)?.stacks ?? 1;
  return applyBleedSource(
    ctx,
    sourceId,
    targetId,
    "lacerate",
    FLAT_DAMAGE,
    SCALING_DAMAGE,
    stacks,
  );
};

const removeFn: RemoveFnType = (ctx, sourceId, targetId) => {
  const stacks = ctx.characters[targetId]?.effects["lacerate"]?.value ?? 0;
  removeBleedSource(ctx, sourceId, targetId, "lacerate", stacks);
  return ctx;
};

const lacerate: EffectType = {
  type: "burden",
  special: "bleed",
  stackable: true,
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip: "Bleeds for bladed damage each turn. Stacks increase damage.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default lacerate;
