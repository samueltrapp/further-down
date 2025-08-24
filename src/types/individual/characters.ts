import { StatsType } from "./stats.ts";
import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponType } from "../equipables/weapons.ts";
import { TacticName } from "../equipables/tactics.ts";
import { BlessingName } from "../equipables/blessings.ts";
import { ArmorType } from "../equipables/armors.ts";
import { CurseName } from "../equipables/curses.ts";
import { EnchantmentName } from "../equipables/enchantments.ts";

export type RewardOptions =
  | "blessings"
  | "curses"
  | "maneuvers"
  | "weapons"
  | "armors"
  | "enchantments";

export type PendingRewardType = Record<RewardOptions, number>;

export type PlayerType = {
  id: string;
  name: string;
  userId: string;
  team: "player";
  stats: StatsType;
  savedStats: StatsType;
  lastTurn: number;
  maneuvers: ManeuverName[];
  weapons: WeaponType[];
  armors: ArmorType[];
  blessings: BlessingName[];
  curses: CurseName;
  enchantments: EnchantmentName[];
  favors: string[];
  burdens: string[];
  pendingRewards: PendingRewardType;
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

export type UnitType = PlayerType | EnemyType;
