import { StatsType } from "./stats.ts";
import { ManeuverName } from "../equipables/actions.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { ArmorName } from "../equipables/armors.ts";
import { EnchantmentName } from "../equipables/enchantments.ts";
import { BurdenName, FavorName } from "../equipables/effects.ts";

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

type EffectType = {
  stacks: number;
  duration: DurationType;
  trigger: TriggerType;
  tooltip: string;
};

type FavorType = Partial<Record<FavorName, EffectType>>;
type BurdenType = Partial<Record<BurdenName, EffectType>>;
type EffectsType = {
  favors: FavorType;
  burdens: BurdenType;
};

export type RewardTypes = "maneuvers" | "weapons" | "armors" | "enchantments";

export type PendingRewardType = Record<RewardTypes, number>;

type TriggerType = "hit" | "turn" | "round" | "battle";
type DurationType =
  | "instant"
  | "hit"
  | "turn"
  | "round"
  | "battle"
  | "permanent";

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
  effects: EffectsType;
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
