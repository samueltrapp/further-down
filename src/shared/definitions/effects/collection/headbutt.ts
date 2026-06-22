import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";

const applyFn: ApplyFnType = (ctx) => ctx;
const removeFn: RemoveFnType = (ctx) => ctx;

const headbutt: EffectType = {
  type: "burden",
  duration: "round",
  stackable: false,
  tooltip: "Reduces EVA by 20 + 1.0[DF]",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default headbutt;
