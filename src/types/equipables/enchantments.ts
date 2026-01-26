import { ActionCtx } from "../events/actionCtx.ts";

export type EnchantmentName =
  | "discipline"
  | "killerInstinct"
  | "redFang"
  | "thousandCuts";

export type EnchantmentType = {
  name: EnchantmentName;
  description: string;
  trigger:
    | "immediate"
    | "attack"
    | "defend"
    | "turn-start"
    | "turn-end"
    | "round-start"
    | "round-end"
    | "battle-start"
    | "battle-end"
    | "permanent";
  expiration:
    | "turn-start"
    | "turn-end"
    | "round-start"
    | "round-end"
    | "battle-end"
    | "never";
  onTrigger: (ctx: ActionCtx) => ActionCtx;
  onExpiration: (ctx: ActionCtx) => ActionCtx;
};
