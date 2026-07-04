import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import {
  applyBleedSource,
  removeBleedSource,
} from "../../../../server/battle/bleed.ts";

const FLAT_DAMAGE = 5;
const SCALING_DAMAGE = 1;

const applyFn: ApplyFnType = (ctx, ids) =>
  applyBleedSource(ctx, ids, FLAT_DAMAGE, SCALING_DAMAGE);

const removeFn: RemoveFnType = (ctx, ids) => {
  ids.forEach((id) => {
    const stacks = ctx.characters[id]?.effects["lacerate"] ?? 0;
    removeBleedSource(
      ctx,
      [id],
      lacerate.owner,
      stacks * FLAT_DAMAGE,
      stacks * SCALING_DAMAGE,
    );
  });
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
