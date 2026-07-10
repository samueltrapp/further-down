import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const EVASION_PER_STACK = 8;

const applyFn = (
  ctx: ActionCtx,
  _source: string,
  targetId: string,
): ActionCtx => {
  const { characters, instance } = ctx;
  const target = characters[targetId];

  const targetInstance = instance.get(targetId);
  if (targetInstance?.evaded) {
    const stacks = target.effects["tall shadow"]?.value ?? 0;
    target.stats.discipline.dodge += stacks * EVASION_PER_STACK;
  }
  return ctx;
};

const removeFn = (ctx: ActionCtx, sourceId: string): ActionCtx => {
  const { characters } = ctx;
  const stacks = characters[sourceId].effects["tall shadow"]?.value ?? 0;
  characters[sourceId].stats.discipline.dodge -= stacks * EVASION_PER_STACK;
  return ctx;
};

const tallShadow: EffectType = {
  type: "favor",
  durationType: "rounds",
  stackable: true,
  tooltip:
    "Gain evasion every time an attack misses you. Lasts until end of battle.",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default tallShadow;
