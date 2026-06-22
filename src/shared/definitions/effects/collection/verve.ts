import { EffectType } from "../../../../types/equipables/effects.ts";

const verve: EffectType = {
  type: "favor",
  duration: "battle",
  stackable: true,
  tooltip: "",
  owner: "",
  onApply: (ctx) => ctx,
  onRemove: (ctx) => ctx,
};

export default verve;
