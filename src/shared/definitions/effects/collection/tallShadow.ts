import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const EVASION_PER_STACK = 5;

const applyFn = (ctx: ActionCtx, ids: string[]): ActionCtx => {
  const { characters, instance } = ctx;
  ids.forEach((id) => {
    const targetInstance = instance.get(id);
    // Only add evasion if the attack actually missed
    if (targetInstance?.evaded) {
      const stacks = characters[id].effects["tall shadow"] || 0;
      characters[id].stats.discipline.dodge += stacks * EVASION_PER_STACK;
    }
  });
  return ctx;
};

const removeFn = (ctx: ActionCtx, ids: string[]): ActionCtx => {
  const { characters } = ctx;
  ids.forEach((id) => {
    const stacks = characters[id].effects["tall shadow"] || 0;
    characters[id].stats.discipline.dodge -= stacks * EVASION_PER_STACK;
  });
  return ctx;
};

const tallShadow: EffectType = {
  type: "favor",
  duration: "battle",
  stackable: true,
  tooltip:
    "Gain evasion every time an attack misses you. Lasts until end of battle.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default tallShadow;
