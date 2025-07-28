import { CharType } from "./characters.ts";

export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

export type OtherManeuverFnArgsType = {
  recipient: CharType;
  actor: CharType;
  maneuver: ManeuverName;
};

export type SelfManeuverFnArgsType = {
  self: CharType;
  maneuver: ManeuverName;
};

export type ManeuverType = {
  speedCost: number;
  maxTargets: number;
  actions: {
    damageType: DamageType;
    strength: number;
  }[];
};
