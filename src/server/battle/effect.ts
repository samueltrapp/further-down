import { StepType } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";
import { DurationType, EffectName } from "../../types/equipables/effects.ts";

export const applyEffect = (
  ctx: ActionCtx,
  sourceId: string,
  targetIds: string[],
  effectName: EffectName,
  stacks = 1,
  step?: StepType,
): ActionCtx => {
  const { characters } = ctx;

  targetIds.forEach((targetId) => {
    const target = characters[targetId];
    const effect = effectMap.get(effectName);
    if (!target || !effect) return;

    const stackable = effect.stackable;
    const existingState = target.effects[effectName];
    const tickDuration =
      effect.durationType === "turns" || effect.durationType === "rounds";
    const duration = effect.duration ?? 1;

    /* Apply fresh stacks if none exist or add new stacks */
    if (!existingState || !stackable) {
      target.effects[effectName] = {
        value: stacks,
        durations: [],
        owner: sourceId,
      };
    } else {
      existingState.value += stacks;
      existingState.owner = sourceId;
    }

    /* Track remaining ticks for turns/rounds effects */
    if (tickDuration) {
      const state = target.effects[effectName]!;
      if (!stackable) {
        state.durations = [duration];
      } else {
        for (let i = 0; i < stacks; i++) {
          state.durations.push(duration);
        }
      }
    }

    if (effect.onApply) {
      ctx = effect.onApply(ctx, sourceId, targetId, step);
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

      const ownerId = state.owner;

      /* battle trigger removes all matching effects immediately */
      if (trigger === "battle") {
        effectDef.onRemove(ctx, ownerId, character.id);
        delete character.effects[effectName];
        return;
      }

      /* turns/rounds: decrement each stack's remaining count */
      const durations = state.durations;
      if (!durations || durations.length === 0) {
        delete character.effects[effectName];
        return;
      }

      let expiredCount = 0;
      for (let i = durations.length - 1; i >= 0; i--) {
        durations[i] -= 1;
        if (durations[i] <= 0) {
          durations.splice(i, 1);
          expiredCount++;
        }
      }

      if (expiredCount > 0) {
        const remaining = state.value - expiredCount;
        if (remaining <= 0) {
          /* All stacks expired — call onRemove once for the full cleanup */
          effectDef.onRemove(ctx, ownerId, character.id);
          delete character.effects[effectName];
        } else {
          /* Partial expiry — call onRemove once per expired stack */
          for (let i = 0; i < expiredCount; i++) {
            effectDef.onRemove(ctx, ownerId, character.id);
          }
          state.value = remaining;
        }
      }
    });
  });

  return ctx;
};
