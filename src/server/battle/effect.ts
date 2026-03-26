import { EffectStep } from "../../types/equipables/maneuvers.ts";
import { ActionCtx } from "../../types/events/actionCtx.ts";
import { burdenMap } from "../../shared/definitions/burdens/sets.ts";
import { favorMap } from "../../shared/definitions/favors/sets.ts";

export const applyEffect = (step: EffectStep, ctx: ActionCtx) => {
  const { burden, favor, stacks } = step;
  const { characters, targetIds } = { ...ctx };

  targetIds?.forEach((targetId) => {
    const target = characters[targetId];
    if (burden) {
      const burdenDtl = burdenMap.get(burden);
      const stackable = burdenDtl?.stackable;
      const burdenValue = target.effects.burdens[burden];
      if (!burdenValue || !stackable) {
        target.effects.burdens[burden] = 1;
      } else if (stacks) {
        target.effects.burdens[burden] = burdenValue + stacks;
      }
    }

    if (favor) {
      const favorDtl = favorMap.get(favor);
      const stackable = favorDtl?.stackable;
      const favorValue = target.effects.favors[favor];
      if (!favorValue || !stackable) {
        target.effects.favors[favor] = 1;
      } else if (stacks) {
        target.effects.favors[favor] = favorValue + stacks;
      }
    }
  });

  return {
    ...ctx,
    characters,
  };
};
