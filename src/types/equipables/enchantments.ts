import { ActionCtx } from "../events/actionCtx.ts";

export enum EnchantmentName {
  A_THOUSAND_CUTS = "aThousandCuts",
  DISCIPLINE = "discipline",
  KILLER_INSTINCT = "killerInstinct",
  RED_FANG = "redFang",
}

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
