import { StatsType } from "./stats.ts";
import { ManeuverType } from "../equipables/maneuvers.ts";
import { WeaponType } from "../equipables/weapons.ts";
import { TacticName } from "../equipables/tactics.ts";
import { BlessingType } from "../equipables/blessings.ts";
import { ArmorType } from "../equipables/armors.ts";
import { CurseType } from "../equipables/curses.ts";
import { EnchantmentType } from "../equipables/enchantments.ts";
import {FavorName} from "../equipables/effects.ts";

type RewardSpread = {
  armors: ArmorType[];
  blessings: BlessingType[];
  curses: CurseType[];
  enchantments: EnchantmentType[];
  maneuvers: ManeuverType[];
  weapons: WeaponType[];
};

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
  effects: {
    favors: Record<FavorName, number>;
    burdens: string[];
    lastTurn: number;
  };
  rewards: {
    owned: RewardSpread;
    queue: RewardSpread;
    pending: PendingRewardType & { stats: number };
  };
};

export type EnemyType = {
  id: string;
  name: string;
  team: "enemy";
  stats: StatsType;
  effects: {
    burdens: string[];
    favors: string[];
    lastTurn: number;
  };
  tactics: TacticName[];
};

export type UnitType = PlayerType | EnemyType;
