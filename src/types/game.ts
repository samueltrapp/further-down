import { ManeuverName } from "./maneuvers.ts";
import { EnemyType, PlayerType } from "./characters.ts";
import { WeaponName } from "./weapons.ts";

type BaseTurnType = {
  gameId: string;
  issuerId: string;
};

export enum GameActions {
  KILL_GAME = "KILL_GAME",
  SELECT_MANEUVER = "SELECT_MANEUVER",
  SELECT_WEAPON = "SELECT_TECHNIQUE",
  SELECT_ENEMY = "SELECT_ENEMY",
  START_GAME = "START_GAME",
  SYNC = "SYNC",
}

export type GameType = {
  characters: (PlayerType | EnemyType)[];
  gameId: string;
  hasStarted: boolean;
  playerCount: number;
  round: number;
  turnNumber: number;
  turnOrder: string[];
};

export type GameMetaType = {
  games: GameType[];
  findGameAndIndex: (gameId: string) => [GameType | undefined, number];
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
