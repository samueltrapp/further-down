import { socket } from "../socket.ts";
import { RewardOptions } from "../../types/individual/characters.ts";

export const takeReward = (rewardOption: RewardOptions, rewardName: string) => {
  socket.emit("take-reward", { type: rewardOption, selection: rewardName });
};
