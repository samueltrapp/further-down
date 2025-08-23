import { ManeuverName } from "./equipables/maneuvers.ts";
import { EnemyType, PlayerType } from "./individual/characters.ts";
import { WeaponName } from "./equipables/weapons.ts";
import { BlessingName } from "./equipables/blessings.ts";
import { CurseName } from "./equipables/curses.ts";
import { ArmorName } from "./equipables/armors.ts";
import { EnchantmentName } from "./equipables/enchantments.ts";

type BaseTurnType = {
  gameId: string;
  issuerId: string;
};

export type LobbyStatusType =
  | "char-create"
  | "waiting"
  | "full"
  | "started"
  | "unjoined";

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
  speedElapsed: number;
  turnOrder: string[];
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatusType;
  pastEncounters: number;
  players: string[];
  startVotes: number;
};

export type RewardOptions =
  | "blessings"
  | "curses"
  | "maneuvers"
  | "weapons"
  | "armors"
  | "enchantments";

export type PendingType = Record<RewardOptions, number>;

export type RewardStateType = {
  pending: PendingType;
  lib: {
    blessings: BlessingName[];
    curses: CurseName[];
    maneuvers: ManeuverName[];
    weapons: WeaponName[];
    armors: ArmorName[];
    enchantments: EnchantmentName[];
  };
};

export type GameType = {
  battle: BattleType | undefined;
  characters: (PlayerType | EnemyType)[];
  lobby: LobbyType;
  rewards: RewardStateType;
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
