import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { EffectStep } from "../../../../types/equipables/maneuvers.ts";
import {
  applyBurnSource,
  removeBurnSource,
} from "../../../../server/battle/burn.ts";

const FLAT_DAMAGE = 0.2;
const SCALING_DAMAGE = 0.15;

const applyFn: ApplyFnType = (ctx, sourceId, targetId, step) => {
  const stacks = (step as EffectStep | undefined)?.stacks ?? 1;
  return applyBurnSource(
    ctx,
    sourceId,
    targetId,
    "combustion",
    FLAT_DAMAGE,
    SCALING_DAMAGE,
    stacks,
  );
};

const removeFn: RemoveFnType = (ctx, sourceId, targetId) => {
  const stacks = ctx.characters[targetId]?.effects["combustion"]?.value ?? 0;
  removeBurnSource(ctx, sourceId, targetId, "combustion", stacks);
  return ctx;
};

const combustion: EffectType = {
  type: "burden",
  special: "burn",
  stackable: true,
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip:
    "Burns for elemental damage each turn. Stacks increase damage per speed.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default combustion;
