import { StatsType } from "./stats.ts";
import { ManeuverType, TacticName } from "../equipables/actions.ts";
import { WeaponType } from "../equipables/weapons.ts";
import { BlessingType } from "../equipables/blessings.ts";
import { ArmorType } from "../equipables/armors.ts";
import { CurseType } from "../equipables/curses.ts";
import { EnchantmentType } from "../equipables/enchantments.ts";
import { FavorName } from "../equipables/effects.ts";

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

type TriggerType = "hit" | "turn" | "round" | "battle";
type DurationType =
  | "instant"
  | "hit"
  | "turn"
  | "round"
  | "battle"
  | "permanent";

export type PlayerType = {
  name: string;
  userId: string;
  team: "player";
  stats: StatsType;
  savedStats: StatsType;
  effects: {
    favors: Partial<
      Record<
        FavorName,
        {
          stacks: number;
          duration: DurationType;
          trigger: TriggerType;
          tooltip: string;
        }
      >
    >;
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
  name: string;
  team: "enemy";
  stats: StatsType;
  base: number;
  effects: {
    burdens: string[];
    favors: string[];
    lastTurn: number;
  };
  tactics: TacticName[];
};

export type UnitType = PlayerType | EnemyType;
