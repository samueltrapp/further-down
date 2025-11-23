import {
  ManeuverName,
  ManeuverType,
  TacticName,
  TacticType,
} from "../equipables/actions.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { CharactersType } from "../game.ts";

export type DamageType = "blunt" | "bladed" | "elemental" | "psychic";

type BaseTurnType = {
  gameId: string;
  sourceId: string;
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

export type MvnOrTctType = ManeuverType | TacticType;

export type MnvOrTctFnType = {
  characters: CharactersType;
  sourceId: string;
  targetIds: string[];
};
