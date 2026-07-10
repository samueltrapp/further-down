import { EffectStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { effectMap } from "../../shared/definitions/effects/sets.ts";
import { DurationType, EffectName } from "../../types/equipables/effects.ts";

export const applyEffect = (
  ctx: ActionCtx,
  sourceId: string,
  step: EffectStep,
) => {
  const { characters, targetIds } = { ...ctx };
  const { effect: effectName, stacks = 1 } = step;

  targetIds?.forEach((targetId) => {
    const target = characters[targetId];
    const effect = effectMap.get(effectName);
    if (!effect) return ctx;

    effect.owner = ctx.sourceId; // TODO: This is weird
    const stackable = effect?.stackable;
    const existingState = target.effects[effectName];
    const tickDuration =
      effect.durationType === "turns" || effect.durationType === "rounds";
    const duration = effect.duration ?? 1;

    /* Apply fresh stacks if none exist or add new stacks */
    if (!existingState || !stackable) {
      target.effects[effectName] = { value: stacks, durations: [] };
    } else if (stacks) {
      existingState.value += stacks;
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

    if (effect?.onApply) {
      targetIds.forEach((targetId) => {
        ctx = effect?.onApply(ctx, sourceId, targetId, step);
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
    Object.entries(character.effects).forEach((effect) => {
      const effectName = effect[0] as EffectName;
      const state = effect[1];
      const effectDef = effectMap.get(effectName);

      if (!effectDef) {
        return;
      }

      if (effectDef.durationType !== trigger) {
        return;
      }

      /* battle trigger removes all matching effects immediately */
      if (trigger === "battle") {
        if (effectDef.onRemove) {
          effectDef.onRemove(ctx, [character.id]);
        }
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
          if (effectDef.onRemove) {
            effectDef.onRemove(ctx, [character.id]);
          }
          delete character.effects[effectName];
        } else {
          /* Partial expiry — call onRemove once per expired stack */
          for (let i = 0; i < expiredCount; i++) {
            if (effectDef.onRemove) {
              effectDef.onRemove(ctx, [character.id]);
            }
          }
          state.value = remaining;
        }
      }
    });
  });

  return ctx;
};
