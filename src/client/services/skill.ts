import { socket } from "../socket.ts";
import {
  SetNameType,
  SubmitPrepareType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";

export const submitName = (name: SetNameType) => {
  socket.emit("char:name", name);
};

export const takeReward = (skill: TakeRewardType) => {
  socket.emit("char:reward", skill);
};

export const takeStats = (stats: TakeStatsType) => {
  socket.emit("char:skill", stats);
};

export const finishSkilling = (skill: { gameId: string; userId: string }) => {
  socket.emit("lobby:skill", skill);
};

export const submitPrepare = (data: SubmitPrepareType) => {
  socket.emit("char:prepare", data);
};
