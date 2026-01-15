import { StatsType } from "./stats.ts";
import { ManeuverType, TacticName } from "../equipables/actions.ts";
import { WeaponType } from "../equipables/weapons.ts";
import { BlessingType } from "../equipables/blessings.ts";
import { ArmorType } from "../equipables/armors.ts";
import { CurseType } from "../equipables/curses.ts";
import { EnchantmentType } from "../equipables/enchantments.ts";
import { BurdenName, FavorName } from "../equipables/effects.ts";

type RewardSpread = {
  armors: ArmorType[];
  blessings: BlessingType[];
  curses: CurseType[];
  enchantments: EnchantmentType[];
  maneuvers: ManeuverType[];
  weapons: WeaponType[];
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

type CharacterType = {
  name: string;
  stats: StatsType;
  effects: EffectsType;
  lastTurn: number;
};

export type PlayerType = CharacterType & {
  userId: string;
  team: "player";
  savedStats: StatsType;
  rewards: {
    owned: RewardSpread;
    queue: RewardSpread;
    pending: PendingRewardType & { stats: number };
  };
};

export type EnemyType = CharacterType & {
  team: "enemy";
  base: number;
  tactics: TacticName[];
};
