import { EffectStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";
import { DurationType, EffectName } from "../../types/equipables/effects.ts";

export const applyEffect = (ctx: ActionCtx, step: EffectStep) => {
  const { characters, targetIds } = { ...ctx };
  const { effect, stacks = 1 } = step;

  targetIds?.forEach((targetId) => {
    const target = characters[targetId];
    const flatEffect = effectMap.get(effect);
    const effectDtl = { ...flatEffect, owner: ctx.sourceId };
    const stackable = effectDtl?.stackable;
    const effectValue = target.effects[effect];
    if (!effectValue || !stackable) {
      target.effects[effect] = 1;
    } else if (stacks) {
      target.effects[effect] = effectValue + stacks;
    }

    if (effectDtl?.onApply) {
      ctx = effectDtl?.onApply(ctx, targetIds, step);
    }
  });

  return ctx;
};

export const removeEffects = (
  ctx: ActionCtx,
  trigger: DurationType,
): ActionCtx => {
  const { characters } = ctx;

  Object.values(characters).forEach((character) => {
    Object.entries(character.effects).forEach((effect) => {
      const effectName = effect[0] as EffectName;
      const effectDef = effectMap.get(effectName);

      if (!effectDef) {
        return;
      }

      if (effectDef.duration === trigger) {
        if (effectDef.onRemove) {
          effectDef.onRemove(ctx, [character.id]);
        }
        delete character.effects[effectName];
      }
    });
  });

  return ctx;
};
