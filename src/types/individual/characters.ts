import { StatsType } from "./stats.ts";
import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { ArmorName } from "../equipables/armors.ts";
import { EnchantmentName } from "../equipables/enchantments.ts";
import { EffectName } from "../equipables/effects.ts";
import { BlessingName } from "../equipables/blessings.ts";

export type PerspectiveType = "own" | "other";
export type TeamType = "player" | "enemy";

type RewardSpread = {
  armors: ArmorName[];
  blessings: BlessingName[];
  // curses: CurseType[];
  enchantments: EnchantmentName[];
  maneuvers: ManeuverName[];
  weapons: WeaponName[];
};

export type RewardTypes =
  | "armors"
  | "blessings"
  | "enchantments"
  | "maneuvers"
  | "weapons";

export type PendingRewardType = Record<RewardTypes, number>;

export type PendingStatsType = {
  core: number;
  discipline: number;
  mastery: number;
};

export type PendingPrepareType = { prepare: number };

export type EnchantmentSocket = WeaponName | ArmorName | null;

export type EnchantmentBinding = {
  name: EnchantmentName;
  socket: EnchantmentSocket;
};

export type EffectStack = {
  value: number;
  duration: number;
  owner: string;
  /* Only used by burn effects, to compute damage since the last tick. */
  lastSpeedElapsed?: number;
};

export type EffectState = {
  stacks: EffectStack[];
};

type CharacterType = {
  id: string;
  name: string;
  equipped: {
    armor: ArmorName | null;
    blessings: BlessingName[];
    enchantments: EnchantmentName[];
    weapon: WeaponName | null;
  };
  loadout: {
    armors: ArmorName[];
    blessings: BlessingName[];
    enchantments: EnchantmentBinding[];
    maneuvers: ManeuverName[];
    weapons: WeaponName[];
  };
  stats: StatsType;
  effects: Partial<Record<EffectName, EffectState>>;
  lastTurn: number;
  isDead: boolean;
};

export type PlayerType = CharacterType & {
  userId: string;
  team: "player";
  pending: PendingRewardType & PendingStatsType & PendingPrepareType;
  private: {
    queue: RewardSpread;
    savedStats: StatsType;
  };
};

export type EnemyType = CharacterType & {
  team: "enemy";
};
