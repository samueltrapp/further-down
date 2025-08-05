import { ManeuverName } from "./maneuvers.ts";
import { EnemyType, PlayerType } from "./characters.ts";
import { WeaponName } from "./weapons.ts";

type BaseTurnType = {
  gameId: string;
  issuerId: string;
};

export type LobbyStatusType = "waiting" | "full" | "started";

export enum GameActions {
  KILL_GAME = "KILL_GAME",
  SELECT_MANEUVER = "SELECT_MANEUVER",
  SELECT_WEAPON = "SELECT_TECHNIQUE",
  SELECT_ENEMY = "SELECT_ENEMY",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  START_GAME = "START_GAME",
  SYNC = "SYNC",
}

export type BattleType = {
  round: number;
  turnNumber: number;
  turnOrder: string[];
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatusType;
  pastEncounters: number;
  players: string[];
  startVotes: number;
};

export type GameType = {
  battle: BattleType | undefined;
  characters: (PlayerType | EnemyType)[];
  lobby: LobbyType;
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
