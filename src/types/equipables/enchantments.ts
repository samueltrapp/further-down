import { ActionCtx } from "../events/actionCtx.ts";
import { StepType } from "./maneuvers.ts";

const PlayerEnchantments = [
  "a thousand cuts",
  "discipline",
  "killer instinct",
  "red fang",
  "sharpen the blade",
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
  trigger: Activation;
  expiration: Activation;
  onTrigger: (ctx: ActionCtx, ids: string[], step?: StepType) => ActionCtx;
  onExpire: (ctx: ActionCtx, ids: string[], step?: StepType) => ActionCtx;
};
