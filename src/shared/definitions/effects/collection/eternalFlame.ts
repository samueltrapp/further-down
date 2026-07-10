import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import {
  applyBurnSource,
  removeBurnSource,
} from "../../../../server/battle/burn.ts";

const FLAT_DAMAGE = 0.05;
const SCALING_DAMAGE = 0.05;

const applyFn: ApplyFnType = (ctx, source, target) =>
  applyBurnSource(
    ctx,
    source,
    target,
    "eternal flame",
    FLAT_DAMAGE,
    SCALING_DAMAGE,
    1,
  );

/* On removal, drops this owner's eternal flame source by its remaining stacks */
const removeFn: RemoveFnType = (ctx, sourceId, targetId) => {
  const stacks = ctx.characters[targetId]?.effects["eternal flame"]?.value ?? 0;
  removeBurnSource(ctx, sourceId, targetId, "eternal flame", stacks);
  return ctx;
};

const eternalFlame: EffectType = {
  type: "burden",
  special: "burn",
  stackable: false,
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip:
    "Burns for elemental damage each turn. Stacks increase damage per speed.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default eternalFlame;
