import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { TacticName } from "../equipables/tactics.ts";

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

export type EnemyClientTurnType = BaseTurnType & {
  team: "enemy";
};

export type EnemyServerTurnType = EnemyClientTurnType & {
  tactic: TacticName;
  targetIds: string[];
};

export type MvnOrTctType = {
  description?: string;
  speedCost: number;
  maxTargets: number;
  steps?: {
    damageType: DamageType;
    strength: number;
  }[];
};
