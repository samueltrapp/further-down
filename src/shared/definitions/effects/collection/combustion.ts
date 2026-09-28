import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { EffectStep } from "../../../../types/equipables/maneuvers.ts";

const FLAT_DAMAGE = 0.2;
const SCALING_DAMAGE = 0.15;

const applyFn: ApplyFnType = (ctx, _sourceId, _targetId, step) => {
  const stacks = (step as EffectStep | undefined)?.stacks ?? 1;
  return { ctx, value: stacks };
};

const removeFn: RemoveFnType = (ctx) => ctx;

const combustion: EffectType = {
  type: "burden",
  special: "burn",
  stackType: "independent",
  durationType: "rounds",
  flatDamage: FLAT_DAMAGE,
  scalingDamage: SCALING_DAMAGE,
  tooltip:
    "Burns for elemental damage each turn. Stacks increase damage per speed.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default combustion;
