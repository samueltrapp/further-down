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

  target.stats.discipline.dodge -=
    FIXED_DDG_REDUCTION + sourceBlt * SCALING_DDG_REDUCTION;
  return ctx;
};

const removeFn: RemoveFnType = (ctx, sourceId, targetId) => {
  const { characters } = ctx;
  const sourceBlt = characters[sourceId]?.stats.mastery.blunt ?? 0;

  characters[targetId].stats.discipline.dodge +=
    FIXED_DDG_REDUCTION + sourceBlt * SCALING_DDG_REDUCTION;
  return ctx;
};

const headbutt: EffectType = {
  type: "burden",
  durationType: "rounds",
  stackable: false,
  tooltip: "Reduces EVA by 20 + 1.0[DF]",
  onApply: applyFn,
  onRemove: removeFn,
};

export default headbutt;
