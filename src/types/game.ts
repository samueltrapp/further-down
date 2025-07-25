import { ManeuverName } from "./maneuvers.ts";
import { EnemyType, PlayerType } from "./characters.ts";

export enum GameActions {
  SELECT_MANEUVER = "SELECT_MANEUVER",
  SELECT_TECHNIQUE = "SELECT_TECHNIQUE",
  SELECT_ENEMY = "SELECT_ENEMY",
  SYNC = "SYNC",
}

export type GameType = {
  characters: (PlayerType | EnemyType)[];
  gameId: string;
  roundNumber: number;
  turnNumber: number;
  turnOrder: string[];
};

export type GameMetaType = {
  games: GameType[];
  findGame: (gameId: string) => GameType | undefined;
  findGameIndex: (gameId: string) => number | undefined;
};

export type TurnType = {
  gameId: string;
  maneuver: ManeuverName;
  targetIds: string[];
  issuerId: string;
};
