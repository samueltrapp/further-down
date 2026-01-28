import {
  ManeuverName,
  ManeuverType,
  TacticType,
} from "../equipables/actions.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { CharactersType } from "../game.ts";

type BaseTurnType = {
  gameId: string;
  sourceId: string;
};

export type PlayerTurnType = BaseTurnType & {
  maneuver: ManeuverName;
  friendlyTargetIds: string[];
  enemyTargetIds: string[];
  team: "player";
  weapon: WeaponName;
};

export type EnemyClientTurnType = BaseTurnType & {
  team: "enemy";
};

export type MvnOrTctType = ManeuverType | TacticType;

export type MnvOrTctFnType = {
  characters: CharactersType;
  sourceId: string;
  targetIds: string[];
};
