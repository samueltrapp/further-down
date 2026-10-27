import { EffectType } from "../../../../types/equipables/effects.ts";

const verve: EffectType = {
  type: "favor",
  durationType: "battle",
  stackType: "independent",
  tooltip: "",
  onApply: (ctx) => ({ ctx, value: 1 }),
  onRemove: (ctx) => ctx,
};

export default verve;
