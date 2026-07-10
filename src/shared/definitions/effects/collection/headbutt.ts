import {
  ApplyFnType,
  EffectType,
  RemoveFnType,
} from "../../../../types/equipables/effects.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";

const FIXED_DDG_REDUCTION = 20;
const SCALING_DDG_REDUCTION = 1;

const applyFn: ApplyFnType = (ctx: ActionCtx, selection: string) => {
  const character = ctx.characters[selection];
  const sourceBlt = character.stats.mastery.blunt;

  character.stats.discipline.dodge -=
    FIXED_DDG_REDUCTION + sourceBlt * SCALING_DDG_REDUCTION;
  return ctx;
};

const removeFn: RemoveFnType = (ctx, ids) => {
  const id = ids[0];
  const { characters, sourceId } = ctx;
  const sourceBlt = characters[sourceId].stats.mastery.blunt;

  characters[id].stats.discipline.dodge +=
    FIXED_DDG_REDUCTION + sourceBlt * SCALING_DDG_REDUCTION;
  return ctx;
};

const headbutt: EffectType = {
  type: "burden",
  durationType: "rounds",
  stackable: false,
  tooltip: "Reduces EVA by 20 + 1.0[DF]",
  owner: "",
  onApply: applyFn,
  onRemove: removeFn,
};

export default headbutt;
