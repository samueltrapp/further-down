import {
  ManeuverName,
  ManeuverType,
  TacticName,
  TacticType,
} from "../equipables/actions.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { CharactersType } from "../game.ts";

type BaseTurnType = {
  gameId: string;
  sourceId: string;
  playerTargetIds: string[];
  enemyTargetIds: string[];
};

export type PlayerTurnType = BaseTurnType & {
  maneuver: ManeuverName;
  team: "player";
  weapon: WeaponName;
};

export type EnemyTurnType = BaseTurnType & {
  tactic: TacticName;
  team: "enemy";
};

export type MvnOrTctType = ManeuverType | TacticType;

export type MnvOrTctFnType = {
  characters: CharactersType;
  sourceId: string;
  targetIds: string[];
};
