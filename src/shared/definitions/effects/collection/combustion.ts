import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import {
  applyBurnSource,
  removeBurnSource,
} from "../../../../server/battle/burn.ts";

const FLAT_DAMAGE = 1;
const SCALING_DAMAGE = 0.5;

const applyFn: ApplyFnType = (ctx, ids) =>
  applyBurnSource(ctx, ids, DAMAGE_PER_SPEED);

/* On removal, subtracts this owner's total contribution from each target's burn sources */
const removeFn: RemoveFnType = (ctx, ids) => {
  ids.forEach((id) => {
    const stacks = ctx.characters[id]?.effects["combustion"] ?? 0;
    removeBurnSource(ctx, [id], combustion.owner, stacks * DAMAGE_PER_SPEED);
  });
  return ctx;
};

const combustion: EffectType = {
  type: "burden",
  special: "burn",
  stackable: true,
  duration: "round",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip:
    "Burns for elemental damage each turn. Stacks increase damage per speed.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default combustion;
