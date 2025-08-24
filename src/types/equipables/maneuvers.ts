import { EnemyType, PlayerType } from "../individual/characters.ts";
import { WeaponName } from "./weapons.ts";

export type ManeuverName = "slap" | "quicksilver" | "fireburst" | "ache";

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
