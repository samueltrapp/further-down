import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";

const applyFn: ApplyFnType = (ctx) => ctx;
const removeFn: RemoveFnType = (ctx) => ctx;

const anguish: EffectType = {
  type: "burden",
  duration: "battle",
  stackable: true,
  tooltip: "Used by various PSY maneuvers and enchantments.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default anguish;
