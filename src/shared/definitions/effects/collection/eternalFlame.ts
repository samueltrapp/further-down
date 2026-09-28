import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";

const FLAT_DAMAGE = 0.05;
const SCALING_DAMAGE = 0.05;

const applyFn: ApplyFnType = (ctx) => ({ ctx, value: 1 });

const removeFn: RemoveFnType = (ctx) => ctx;

const eternalFlame: EffectType = {
  type: "burden",
  special: "burn",
  stackType: "escalate",
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip:
    "Burns for elemental damage each turn. Stacks increase damage per speed.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default eternalFlame;
