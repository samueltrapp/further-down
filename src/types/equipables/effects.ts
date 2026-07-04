import { ActionCtx } from "../events/actionCtx.ts";
import { StepType } from "./maneuvers.ts";

const BurdenName = ["anguish", "combustion", "headbutt", "lacerate"] as const;
const FavorName = ["sharpen the blade", "tall shadow", "verve"] as const;

export type BurdenName = (typeof BurdenName)[number];
export type FavorName = (typeof FavorName)[number];
export type EffectName = BurdenName | FavorName;

export type DurationType = "turns" | "rounds" | "battle" | "permanent";

export type ApplyFnType = (
  ctx: ActionCtx,
  ids: string[],
  step?: StepType,
) => ActionCtx;
export type RemoveFnType = (ctx: ActionCtx, ids: string[]) => ActionCtx;

export type EffectType = {
  type: "burden" | "favor";
  special?: "burn" | "bleed";
  stackable: boolean;
  durationType: DurationType;
  duration?: number;
  flatDamage?: number;
  scalingDamage?: number;
  tooltip: string;
  owner: string;
  onApply: ApplyFnType;
  onRemove: RemoveFnType;
};
