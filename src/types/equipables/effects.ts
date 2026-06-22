import { ActionCtx } from "../events/actionCtx.ts";
import { StepType } from "./maneuvers.ts";

const BurdenName = ["anguish", "headbutt"] as const;
const FavorName = ["sharpen the blade", "tall shadow", "verve"] as const;

export type BurdenName = (typeof BurdenName)[number];
export type FavorName = (typeof FavorName)[number];
export type EffectName = BurdenName | FavorName;

export type DurationType = "turn" | "round" | "battle" | "permanent";

export type ApplyFnType = (
  ctx: ActionCtx,
  ids: string[],
  step?: StepType,
) => ActionCtx;
export type RemoveFnType = (ctx: ActionCtx, ids: string[]) => ActionCtx;

export type EffectType = {
  type: "burden" | "favor";
  stackable: boolean;
  duration: DurationType;
  tooltip: string;
  owner: string;
  onApply: ApplyFnType;
  onRemove: RemoveFnType;
};
