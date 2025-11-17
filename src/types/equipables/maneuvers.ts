import { DamageType } from "../events/turn.ts";

export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

export type ManeuverType = {
  name: ManeuverName;
  description: string;
  speedCost: number;
  maxTargets: number;
  steps: {
    damageType: DamageType;
    strength: number;
  }[];
};