import { EffectType } from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import { trunc } from "../../../../server/utils/battle.ts";

const DODGE_BASE = 10;
const DODGE_SCALING = 0.25;

const applyFn = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
): { ctx: ActionCtx; value: number } => {
  const { characters } = ctx;
  const source = characters[sourceId];
  const target = characters[targetId];

  if (!source || !target) return { ctx, value: 0 };

  const dodgeBonus =
    DODGE_BASE + trunc(source.stats.mastery.plating * DODGE_SCALING);
  target.stats.discipline.dodge += dodgeBonus;

  return { ctx, value: dodgeBonus };
};

const removeFn = (
  ctx: ActionCtx,
  _sourceId: string,
  targetId: string,
  value: number,
): ActionCtx => {
  const { characters } = ctx;
  const target = characters[targetId];

  if (!target) return ctx;

  // Use the stored applied value instead of recalculating
  target.stats.discipline.dodge -= value;

  return ctx;
};

const gossamer: EffectType = {
  type: "favor",
  durationType: "rounds",
  stackType: "escalate",
  tooltip:
    "Grants 10 + (25% caster's plating) evasion until the end of the round",
  onApply: applyFn,
  onRemove: removeFn,
};

export default gossamer;
