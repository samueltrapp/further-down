import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { EffectStep } from "../../../../types/equipables/maneuvers.ts";

const FLAT_DAMAGE = 5;
const SCALING_DAMAGE = 1;

const applyFn: ApplyFnType = (ctx, _sourceId, _targetId, step) => {
  const stacks = (step as EffectStep | undefined)?.stacks ?? 1;
  return { ctx, value: stacks };
};

const removeFn: RemoveFnType = (ctx) => ctx;

const lacerate: EffectType = {
  type: "burden",
  special: "bleed",
  stackType: "independent",
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip: "Bleeds for bladed damage each turn. Stacks increase damage.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default lacerate;
