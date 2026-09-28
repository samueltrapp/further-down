import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const FIXED_DDG_REDUCTION = 20;
const SCALING_DDG_REDUCTION = 1;

/* Reduces the target's evasion, scaled by the attacker's blunt mastery
   at the time of application. */
const applyFn: ApplyFnType = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
) => {
  const { characters } = ctx;
  const target = characters[targetId];
  const sourceBlt = characters[sourceId]?.stats.mastery.blunt ?? 0;

  const reduction = FIXED_DDG_REDUCTION + sourceBlt * SCALING_DDG_REDUCTION;
  target.stats.discipline.dodge -= reduction;
  return { ctx, value: reduction };
};

const removeFn: RemoveFnType = (ctx, _sourceId, targetId, value) => {
  const { characters } = ctx;

  characters[targetId].stats.discipline.dodge += value;
  return ctx;
};

const headbutt: EffectType = {
  type: "burden",
  durationType: "rounds",
  stackType: "escalate",
  tooltip: "Reduces EVA by 20 + 1.0[DF]",
  onApply: applyFn,
  onRemove: removeFn,
};

export default headbutt;
