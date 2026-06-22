import { EffectType } from "./effects.ts";
import { ActionCtx } from "../events/actionCtx.ts";
import { StepType } from "./maneuvers.ts";

const PlayerEnchantments = [
  "a thousand cuts",
  "discipline",
  "killer instinct",
  "red fang",
  "sharpen the blade",
  "tall shadow",
] as const;
type PlayerEnchantments = (typeof PlayerEnchantments)[number];

// Enemy enchantments
export type EnchantmentName = PlayerEnchantments;

const Activation = [
  "immediate",
  "attack",
  "defend",
  "turn-start",
  "turn-end",
  "round-start",
  "round-end",
  "battle-start",
  "battle-end",
  "never",
] as const;
export type Activation = (typeof Activation)[number];

export type EnchantmentType = {
  name: EnchantmentName;
  description: string;
  priority: number;
  socketType: "weapon" | "armor";
  trigger: Activation;
  effect?: EffectType;
  onTrigger?: (
    ctx: ActionCtx,
    applicableIds: string[],
    step?: StepType,
  ) => ActionCtx;
};
