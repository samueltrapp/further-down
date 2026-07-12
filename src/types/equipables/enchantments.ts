import { EffectType } from "./effects.ts";
import { ActionCtx } from "../events/actionCtx.ts";
import { StepType } from "./maneuvers.ts";

export type TriggerFn = (
  ctx: ActionCtx,
  sourceId: string,
  targetId: string,
  step?: StepType,
) => ActionCtx;

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

const Selection = [
  "self",
  "targets",
  "all-allies",
  "all-enemies",
  "random-ally",
  "random-enemy",
];
export type Selection = (typeof Selection)[number];

export type EnchantmentType = {
  name: EnchantmentName;
  description: string;
  priority: number;
  socketType: "weapon" | "armor";
  trigger: Activation;
  selection: Selection;
  effect?: EffectType;
  onTrigger?: TriggerFn;
};
