import { socket } from "../socket.ts";
import { SkillType } from "../../types/events/skill.ts";

export const takeReward = (skill: SkillType) => {
  socket.emit("take-reward", skill);
};
