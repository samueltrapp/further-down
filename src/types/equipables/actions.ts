import { DamageType } from "../events/turn.ts";

// All maneuvers
export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

// All tactics
export type TacticName = "sporeBurst" | "bonk";

type BaseActionType = {
  description: string;
  speedCost: number;
  maxTargets: number;
  steps: {
    damageType: DamageType;
    strength: number;
  }[];
};

export type ManeuverType = BaseActionType & {
  name: ManeuverName;
};

export type TacticType = BaseActionType & {
  name: TacticName;
};
