import { ManeuverType } from "./equipables/maneuvers.ts";
import { EnemyType, PlayerType } from "./individual/characters.ts";
import { WeaponType } from "./equipables/weapons.ts";
import { BlessingType } from "./equipables/blessings.ts";
import { CurseType } from "./equipables/curses.ts";
import { ArmorType } from "./equipables/armors.ts";
import { EnchantmentType } from "./equipables/enchantments.ts";

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

export type LibType = {
  blessings: BlessingType[];
  curses: CurseType[];
  maneuvers: ManeuverType[];
  weapons: WeaponType[];
  armors: ArmorType[];
  enchantments: EnchantmentType[];
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatus;
  pastEncounters: number;
  users: string[];
  votes: string[];
  errorMessage: string | undefined;
};

export type CharactersType = {
  players: PlayerType[];
  enemies: EnemyType[];
};

export type GameType = {
  battle: BattleType | undefined;
  characters: CharactersType;
  lib: LibType;
  lobby: LobbyType;
};
