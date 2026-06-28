import { StatsType } from "./stats.ts";
import { ManeuverName } from "../equipables/maneuvers.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { ArmorName } from "../equipables/armors.ts";
import { EnchantmentName } from "../equipables/enchantments.ts";
import { EffectName } from "../equipables/effects.ts";

export type PerspectiveType = "own" | "other";
export type TeamType = "player" | "enemy";

type RewardSpread = {
  armors: ArmorName[];
  // blessings: BlessingType[];
  // curses: CurseType[];
  enchantments: EnchantmentName[];
  maneuvers: ManeuverName[];
  weapons: WeaponName[];
};

export type RewardTypes = "maneuvers" | "weapons" | "armors" | "enchantments";

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

export type BurnSourceState = {
  damagePerSpeed: number;
  lastSpeedElapsed: number;
};

type CharacterType = {
  id: string;
  name: string;
  equipped: {
    armor: ArmorName | null;
    enchantments: EnchantmentName[];
    weapon: WeaponName | null;
  };
  loadout: {
    armors: ArmorName[];
    enchantments: EnchantmentBinding[];
    maneuvers: ManeuverName[];
    weapons: WeaponName[];
  };
  stats: StatsType;
  effects: Partial<Record<EffectName, number>>;
  burnSources: Record<string, BurnSourceState>;
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
