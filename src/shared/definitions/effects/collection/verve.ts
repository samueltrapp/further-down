import { EffectType } from "../../../../types/equipables/effects.ts";

const verve: EffectType = {
  type: "favor",
  durationType: "battle",
  stackable: true,
  tooltip: "",
  owner: "",
  onApply: (ctx) => ctx,
  onRemove: (ctx) => ctx,
};

export default verve;
