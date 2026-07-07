import { ActionCtx } from "../events/actionCtx.ts";

export type BlessingName =
  | "eternal flame";

const BlessingActivation = [
  "turn-start",
  "turn-end",
  "round-start",
  "round-end",
  "battle-start",
  "battle-end",
] as const;
export type BlessingActivation = (typeof BlessingActivation)[number];

export type BlessingType = {
  name: BlessingName;
  description: string;
  trigger: BlessingActivation;
  onTrigger?: (ctx: ActionCtx, applicableIds: string[]) => ActionCtx;
};
