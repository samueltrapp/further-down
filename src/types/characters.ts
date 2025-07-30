import { StatsType } from "./stats.ts";
import { ManeuverName } from "./maneuvers.ts";
import { WeaponType } from "./weapons.ts";

export type PlayerType = {
  id: string;
  name: string;
  playerId?: string;
  team: "player";
  stats: StatsType;
  statsHistory: StatsType;
  lastTurn: number;
  knownManeuvers: ManeuverName[];
  ownedWeapons: WeaponType[];
  favors: string[];
  burdens: string[];
};

export type EnemyType = {
  id: string;
  name: string;
  team: "enemy";
  stats: StatsType;
  lastTurn: number;
  knownManeuvers: ManeuverName[];
  favors: string[];
  burdens: string[];
};

export type CharType = PlayerType | EnemyType;
