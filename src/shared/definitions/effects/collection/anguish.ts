import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";

const applyFn: ApplyFnType = (ctx) => ({ ctx, value: 1 });
const removeFn: RemoveFnType = (ctx) => ctx;

const anguish: EffectType = {
  type: "burden",
  durationType: "battle",
  stackType: "independent",
  tooltip: "Used by various PSY maneuvers and enchantments.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default anguish;
