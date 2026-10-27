import { RewardTypes } from "../individual/characters.ts";
import { StatsType } from "../individual/stats.ts";
import { WeaponName } from "../equipables/weapons.ts";
import { ArmorName } from "../equipables/armors.ts";
import { EnchantmentName } from "../equipables/enchantments.ts";
import { BlessingName } from "../equipables/blessings.ts";

export type StatCategory = keyof StatsType;

export type SetNameType = {
  name: string;
  gameId: string;
  characterId: string;
};

export type TakeRewardType = {
  rewardType: RewardTypes;
  rewardName: string;
  gameId: string;
  characterId: string;
};

export type TakeStatsType = {
  newStats: StatsType;
  category: StatCategory;
  gameId: string;
  characterId: string;
};

export type SubmitPrepareType = {
  gameId: string;
  characterId: string;
  weaponSockets: Partial<Record<WeaponName, EnchantmentName[]>>;
  armorSockets: Partial<Record<ArmorName, EnchantmentName[]>>;
  weapon: WeaponName;
  armor: ArmorName;
  blessings: BlessingName[];
};
