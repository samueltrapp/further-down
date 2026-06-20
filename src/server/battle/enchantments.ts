import { ActionCtx } from "../../types/events/actionCtx.ts";
import { enchantmentMap } from "../../shared/definitions/enchantments/sets.ts";
import {
  Activation,
  EnchantmentType,
} from "../../types/equipables/enchantments.ts";
import { StepType } from "../../types/equipables/maneuvers.ts";

const applicableIds = (ctx: ActionCtx, trigger: Activation) => {
  const allIds = (() => {
    const ids = [];
    for (const char in ctx.characters) {
      ids.push(char);
    }
    return ids;
  })();

  switch (trigger) {
    case "attack":
      return [ctx.sourceId];
    case "defend":
      return ctx.targetIds;
    case "turn-start":
    case "turn-end":
    case "round-start":
    case "round-end":
    case "battle-start":
    case "battle-end":
    default:
      return allIds;
  }
};

export const handleEnchantments = (
  ctx: ActionCtx,
  activation: Activation,
  step?: StepType,
) => {
  const ids = applicableIds(ctx, activation);
  const charEnchantments = ids.map(
    (id) => ctx.characters[id].equipped.enchantments,
  );

  charEnchantments.forEach((char) => {
    let enchantments: EnchantmentType[] = [];

    char.forEach((enchantment) => {
      const enchantmentDfn = enchantmentMap.get(enchantment);
      if (enchantmentDfn?.trigger === activation) {
        enchantments.push(enchantmentDfn);
        enchantments = enchantments.sort((a, b) => a.priority - b.priority);
      }
    });

    enchantments.forEach((enchantment) => {
      if (enchantment.onTrigger) {
        ctx = enchantment.onTrigger(ctx, ids, step);
      }
      if (enchantment.effect) {
        ctx = enchantment.effect.onApply(ctx, ids, step);
      }
    });
  }, [] as EnchantmentType[]);

  return ctx;
};
