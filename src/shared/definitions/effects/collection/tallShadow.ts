import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const EVASION_PER_STACK = 8;

const applyFn = (
  ctx: ActionCtx,
  _source: string,
  targetId: string,
): { ctx: ActionCtx; value: number } => {
  const { characters, instance } = ctx;
  const target = characters[targetId];

  const targetInstance = instance.get(targetId);
  let gained = 0;
  if (targetInstance?.evaded) {
    gained = EVASION_PER_STACK;
    target.stats.discipline.dodge += gained;
  }
  return { ctx, value: gained };
};

const removeFn = (
  ctx: ActionCtx,
  _sourceId: string,
  targetId: string,
  value: number,
): ActionCtx => {
  const { characters } = ctx;
  characters[targetId].stats.discipline.dodge -= value;
  return ctx;
};

const tallShadow: EffectType = {
  type: "favor",
  durationType: "rounds",
  stackType: "escalate",
  tooltip:
    "Gain evasion every time an attack misses you. Lasts until end of battle.",
  onApply: applyFn,
  onRemove: removeFn,
};

export default tallShadow;
