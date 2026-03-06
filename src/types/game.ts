import { EnemyType, PlayerType } from "./individual/characters.ts";
import { ManeuverName } from "./equipables/actions.ts";
import { WeaponName } from "./equipables/weapons.ts";

export enum BattleGrade {
  BOSS = "boss",
  MINI = "mini",
  MINOR = "minor",
  MODERATE = "moderate",
  MAJOR = "major",
}

export enum LobbyStatus {
  BATTLE = "battle",
  EXPLORATION = "exploration",
  FULL = "full",
  PREPARE = "prepare",
  REWARD = "reward",
  SUMMARY = "summary",
  UNJOINED = "unjoined",
  WAITING = "waiting",
}

export enum Victor {
  ENEMY = "enemy",
  NONE = "none",
  PLAYER = "player",
}

export type TurnLog = {
  headline: string;
  steps?: string[];
};

export type BattleType = {
  grade: BattleGrade;
  messages: TurnLog[];
  round: number;
  speedElapsed: number;
  turnOrder: string[];
  victor: Victor;
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatus;
  pastEncounters: number;
  users: string[];
  votes: string[];
  errorMessage: string | undefined;
};

export type CharactersType = Record<string, PlayerType | EnemyType>;

export type GameType = {
  battle: BattleType | null;
  characters: CharactersType | null;
  lobby: LobbyType;
};

export type GameStateType = {
  data: GameType;
  client: GameClientType;
};

export type GameClientType = {
  maxEnemySelections: number;
  selectedEnemyIds: string[];
  selectedFriendlyIds: string[];
  selectedManeuver: ManeuverName | "";
  selectedWeapon: WeaponName | "";
};
