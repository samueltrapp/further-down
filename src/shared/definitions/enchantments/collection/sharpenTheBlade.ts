import { EnchantmentType } from "../../../../types/equipables/enchantments.ts";
import sharpenTheBlade from "../../effects/collection/sharpenTheBlade.ts";

export const sharpenTheBladeEnch: EnchantmentType = {
  name: "sharpen the blade",
  description:
    "Each hit with BLD damage increases your BLD by 1 until the end of the round.",
  socketType: "weapon",
  selection: "self",
  trigger: "attack",
  priority: 0,
  effect: sharpenTheBlade,
};
