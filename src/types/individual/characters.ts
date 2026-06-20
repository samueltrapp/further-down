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
    enchantments: EnchantmentName[];
    maneuvers: ManeuverName[];
    weapons: WeaponName[];
  };
  stats: StatsType;
  effects: Partial<Record<EffectName, number>>;
  lastTurn: number;
  isDead: boolean;
};

export type PlayerType = CharacterType & {
  userId: string;
  team: "player";
  pending: PendingRewardType & { stats: number };
  private: {
    queue: RewardSpread;
    savedStats: StatsType;
  };
};

export type EnemyType = CharacterType & {
  team: "enemy";
};
