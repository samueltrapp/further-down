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

export const applyEnchantments = (
  ctx: ActionCtx,
  activation: Activation,
  situation: "trigger" | "expire" | "combined",
  step?: StepType,
) => {
  const ids = applicableIds(ctx, activation);

  const charEnchantments = ids.map(
    (id) => ctx.characters[id].equipped.enchantments,
  );

  charEnchantments.forEach((char) => {
    let triggeringEnchantments: EnchantmentType[] = [];
    let expiringEnchantments: EnchantmentType[] = [];
    const isTriggering = situation === "trigger" || situation === "combined";
    const isExpiring = situation === "expire" || situation === "combined";

    char.forEach((enchantment) => {
      const enchantmentDfn = enchantmentMap.get(enchantment);
      if (isTriggering && enchantmentDfn?.trigger === activation) {
        triggeringEnchantments.push(enchantmentDfn);
        triggeringEnchantments = triggeringEnchantments.sort(
          (a, b) => b.priority - a.priority,
        );
      }
      if (isExpiring && enchantmentDfn?.expiration === activation) {
        expiringEnchantments.push(enchantmentDfn);
        expiringEnchantments = expiringEnchantments.sort(
          (a, b) => b.priority - a.priority,
        );
      }
    });

    triggeringEnchantments.forEach((enchantment) => {
      ctx = enchantment.onTrigger(ctx, ids, step);
    });
    expiringEnchantments.forEach((enchantment) => {
      ctx = enchantment.onExpire(ctx, ids, step);
    });
  }, [] as EnchantmentType[]);

  return ctx;
};
