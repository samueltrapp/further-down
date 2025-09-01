import { socket } from "../socket.ts";
import { TakeRewardType, TakeStatsType } from "../../types/events/skill.ts";

export const takeReward = (skill: TakeRewardType) => {
  socket.emit("take-reward", skill);
};

export const takeStats = (stats: TakeStatsType) => {
  socket.emit("take-stats", stats);
};
