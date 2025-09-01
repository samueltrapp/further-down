import { RewardOptions } from "../individual/characters.ts";
import { StatsType } from "../individual/stats.ts";

export type TakeRewardType = {
  rewardOption: RewardOptions;
  rewardName: string;
  gameId: string;
  characterId: string;
};

export type TakeStatsType = {
  newStats: StatsType;
  gameId: string;
  characterId: string;
};
