import { ManeuverName } from "./equipables/maneuvers.ts";
import { EnemyType, PlayerType } from "./individual/characters.ts";
import { WeaponName } from "./equipables/weapons.ts";
import { BlessingName } from "./equipables/blessings.ts";
import { CurseName } from "./equipables/curses.ts";
import { ArmorName } from "./equipables/armors.ts";
import { EnchantmentName } from "./equipables/enchantments.ts";

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
  grade: "boss" | "mini" | "major" | "moderate" | "minor";
};

export type LibType = {
  blessings: BlessingName[];
  curses: CurseName[];
  maneuvers: ManeuverName[];
  weapons: WeaponName[];
  armors: ArmorName[];
  enchantments: EnchantmentName[];
};

export type LobbyType = {
  gameId: string;
  status: LobbyStatus;
  pastEncounters: number;
  users: string[];
  startVotes: number;
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
