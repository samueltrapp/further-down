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

export type LobbyType = {
  gameId: string;
  status: LobbyStatus;
  pastEncounters: number;
  players: string[];
  startVotes: number;
  errorMsg: string | undefined;
};

export type CharactersType = {
  players: PlayerType[];
  enemies: EnemyType[];
};

export type GameType = {
  battle: BattleType | undefined;
  characters: CharactersType;
  lib: {
    blessings: BlessingName[];
    curses: CurseName[];
    maneuvers: ManeuverName[];
    weapons: WeaponName[];
    armors: ArmorName[];
    enchantments: EnchantmentName[];
  };
  lobby: LobbyType;
};

export type GameMetaType = {
  games: GameType[];
  findGameAndIndex: (gameId: string) => [GameType | undefined, number];
};
