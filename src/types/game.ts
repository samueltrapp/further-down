import { EnemyType, PlayerType } from "./individual/characters.ts";

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
  UNJOINED = "unjoined",
  WAITING = "waiting",
}

export type BattleType = {
  round: number;
  speedElapsed: number;
  turnOrder: string[];
  grade: BattleGrade;
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatus;
  pastEncounters: number;
  users: string[];
  votes: string[];
  errorMessage: string | undefined;
};

export type CharactersType = Map<string, PlayerType | EnemyType>;

export type GameType = {
  battle: BattleType | null;
  characters: CharactersType;
  lobby: LobbyType;
};
