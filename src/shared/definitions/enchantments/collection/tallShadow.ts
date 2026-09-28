import { EnchantmentType } from "../../../../types/equipables/enchantments.ts";
import { ActionCtx } from "../../../../types/events/actionCtx.ts";
import tallShadow from "../../effects/collection/tallShadow.ts";

const onTrigger = (ctx: ActionCtx, selection: string): ActionCtx => {
  const { instance, characters } = ctx;
  const defenderInstance = instance.get(selection);
  if (defenderInstance?.evaded) {
    const defender = characters[selection];
    ctx.messages.steps?.push(`${defender.name} // TALL SHADOW`);
  }

  return ctx;
};

export const tallShadowEnch: EnchantmentType = {
  name: "tall shadow",
  description:
    "When an attack misses you, gain a shadow stack that increases your EVA by 5. Stacks persist until the end of battle.",
  socketType: "armor",
  trigger: "defend",
  selection: "self",
  priority: 15,
  effect: tallShadow,
  onTrigger,
};
