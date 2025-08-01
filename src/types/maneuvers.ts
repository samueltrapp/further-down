import { EnemyType, PlayerType } from "./characters.ts";
import { WeaponName } from "./weapons.ts";

export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

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

export type ManeuverType = {
  speedCost: number;
  maxTargets: number;
  actions: {
    damageType: DamageType;
    strength: number;
  }[];
};
