import { StatsType } from "./stats.ts";
import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponType } from "../equipables/weapons.ts";
import { TacticName } from "../equipables/tactics.ts";
import { BlessingType } from "../equipables/blessings.ts";

export type PlayerType = {
  id: string;
  name: string;
  userId?: string;
  team: "player";
  stats: StatsType;
  statsHistory: StatsType;
  lastTurn: number;
  maneuvers: ManeuverName[];
  weapons: WeaponType[];
  blessings: BlessingType[];
  favors: string[];
  burdens: string[];
};

export type EnemyType = {
  id: string;
  name: string;
  team: "enemy";
  stats: StatsType;
  lastTurn: number;
  tactics: TacticName[];
  favors: string[];
  burdens: string[];
};

export type CharType = PlayerType | EnemyType;
