import { EnemyType, PlayerType } from "../individual/characters.ts";
import { WeaponName } from "./weapons.ts";
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

export type OtherManeuverFnArgsType = {
  recipient: EnemyType;
  actor: PlayerType;
  maneuver: ManeuverName;
  weapon: WeaponName;
};

export type SelfManeuverFnArgsType = {
  self: PlayerType;
  maneuver: ManeuverName;
  weapon: WeaponName;
};
