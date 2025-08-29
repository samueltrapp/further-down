import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponName } from "../equipables/weapons.ts";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

type BaseTurnType = {
  gameId: string;
  issuerId: string;
};

export type PlayerTurnType = BaseTurnType & {
  maneuver: ManeuverName;
  targetIds: string[];
  team: "player";
  weapon: WeaponName;
};

export type EnemyTurnType = BaseTurnType & {
  team: "enemy";
};

export type MvnOrTctType = {
  speedCost: number;
  maxTargets: number;
  actions: {
    damageType: DamageType;
    strength: number;
  }[];
};
