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
    if (value === 0) return;

    /* Apply fresh stacks if none exist or override existing value */
    if (!existingState || effect.stackType === "none") {
      target.effects[effectName] = {
        stacks: [
          {
            value,
            duration,
            owner: sourceId,
            lastSpeedElapsed: ctx.speedElapsed,
          },
        ],
      };
      // Reset effect duration
    } else if (effect.stackType === "refresh") {
      /* Find existing stack from this owner to refresh, or create new one */
      const ownerStack = existingState.stacks.find(
        (stack) => stack.owner === sourceId,
      );
      if (ownerStack) {
        ownerStack.duration = duration;
      } else {
        existingState.stacks.push({
          value,
          duration,
          owner: sourceId,
          lastSpeedElapsed: ctx.speedElapsed,
        });
      }
      // Increase effect magnitude
    } else if (effect.stackType === "escalate") {
      /* Find existing stack from this owner to escalate, or create new one */
      const ownerStack = existingState.stacks.find(
        (stack) => stack.owner === sourceId,
      );
      if (ownerStack) {
        ownerStack.value += value;
      } else {
        existingState.stacks.push({
          value,
          duration,
          owner: sourceId,
          lastSpeedElapsed: ctx.speedElapsed,
        });
      }
      // Add new effect instance
    } else if (effect.stackType === "independent") {
      existingState.stacks.push({
        value,
        duration,
        owner: sourceId,
        lastSpeedElapsed: ctx.speedElapsed,
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
