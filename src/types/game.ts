import { ManeuverName } from "./maneuvers.ts";
import { EnemyType, PlayerType } from "./characters.ts";
import { WeaponName } from "./weapons.ts";
import { TacticName } from "./tactics.ts";

type BaseTurnType = {
  gameId: string;
  targetIds: string[];
  issuerId: string;
};

export enum GameActions {
  SELECT_MANEUVER = "SELECT_MANEUVER",
  SELECT_WEAPON = "SELECT_TECHNIQUE",
  SELECT_ENEMY = "SELECT_ENEMY",
  SYNC = "SYNC",
}

export type GameType = {
  characters: (PlayerType | EnemyType)[];
  gameId: string;
  round: number;
  turnNumber: number;
  turnOrder: string[];
};

export type GameMetaType = {
  games: GameType[];
  findGame: (gameId: string) => GameType | undefined;
  findGameIndex: (gameId: string) => number | undefined;
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
