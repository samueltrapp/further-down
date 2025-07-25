import { StatsType } from "./stats.ts";
import { ManeuverName } from "./maneuvers.ts";
import { TechniqueName } from "./techniques.ts";

export type PlayerType = {
  id: string;
  name: string;
  playerId?: string;
  team: "player";
  stats: StatsType;
  statsHistory: StatsType;
  lastTurn: number;
  knownManeuvers: ManeuverName[];
  knownTechniques: TechniqueName[];
  buffs: string[];
  debuffs: string[];
};

export type EnemyType = {
  id: string;
  name: string;
  team: "enemy";
  stats: StatsType;
  lastTurn: number;
  knownManeuvers: ManeuverName[];
  knownTechniques: TechniqueName[];
  buffs: string[];
  debuffs: string[];
};

export type CharType = PlayerType | EnemyType;
