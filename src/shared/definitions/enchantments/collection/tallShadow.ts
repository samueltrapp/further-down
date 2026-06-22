import { EnchantmentType } from "../../../../types/equipables/enchantments.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import tallShadow from "../../effects/collection/tallShadow.ts";

const onTrigger = (ctx: ActionCtx, applicableIds: string[]): ActionCtx => {
  const { instance, characters } = ctx;

  // Check each target to see if they evaded the attack
  applicableIds.forEach((targetId) => {
    const targetInstance = instance.get(targetId);
    if (targetInstance?.evaded) {
      // Attack missed this target
      const target = characters[targetId];
      const currentStacks = target.effects["tall shadow"] || 0;
      target.effects["tall shadow"] = currentStacks + 1;

      // Log the effect
      ctx.messages.steps?.push(`${target.name} // TALL SHADOW`);
    }
  });

  return ctx;
};

export const tallShadowEnch: EnchantmentType = {
  name: "tall shadow",
  description:
    "When an attack misses you, gain a shadow stack that increases your EVA by 5. Stacks persist until the end of battle.",
  socketType: "armor",
  trigger: "defend",
  priority: 15,
  effect: tallShadow,
  onTrigger,
};
