import { StepType } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";
import { DurationType, EffectName } from "../../types/equipables/effects.ts";

export const applyEffect = (
  ctx: ActionCtx,
  sourceId: string,
  targetIds: string[],
  effectName: EffectName,
  step?: StepType,
): ActionCtx => {
  const { characters } = ctx;

  targetIds.forEach((targetId) => {
    const target = characters[targetId];
    const effect = effectMap.get(effectName);
    if (!target || !effect) return;

    const existingState = target.effects[effectName];
    const duration = effect.duration ?? 1;

    const { ctx: newCtx, value } = effect.onApply(
      ctx,
      sourceId,
      targetId,
      step,
    );
    ctx = newCtx;

    /* Apply fresh stacks if none exist or override existing value */
    if (!existingState || effect.stackType === "none") {
      target.effects[effectName] = {
        stacks: [
          {
            value,
            duration,
            owner: sourceId,
          },
        ],
      };
      // Reset effect duration
    } else if (effect.stackType === "refresh") {
      existingState.stacks[0].duration = duration;
      existingState.stacks[0].owner = sourceId;
      // Increase effect magnitude
    } else if (effect.stackType === "escalate") {
      existingState.stacks[0].value += value;
      existingState.stacks[0].owner = sourceId;
      // Add new effect instance
    } else if (effect.stackType === "independent") {
      existingState.stacks.push({
        value,
        duration,
        owner: sourceId,
      });
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
    Object.entries(character.effects).forEach(([name, state]) => {
      const effectName = name as EffectName;
      const effectDef = effectMap.get(effectName);

      if (!effectDef || !state) {
        return;
      }

      if (effectDef.durationType !== trigger) {
        return;
      }

      /* battle trigger removes all matching effects immediately */
      if (trigger === "battle") {
        state.stacks.forEach((stack) => {
          effectDef.onRemove(ctx, stack.owner, character.id, stack.value);
        });
        delete character.effects[effectName];
        return;
      }

      /* turns/rounds: decrement each stack's remaining duration, removing
         and reversing each expired stack individually */
      for (let i = state.stacks.length - 1; i >= 0; i--) {
        const stack = state.stacks[i];
        stack.duration -= 1;
        if (stack.duration <= 0) {
          effectDef.onRemove(ctx, stack.owner, character.id, stack.value);
          state.stacks.splice(i, 1);
        }
      }

      if (state.stacks.length === 0) {
        delete character.effects[effectName];
      }
    });
  });

  return ctx;
};
