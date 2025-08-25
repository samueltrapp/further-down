import { socket } from "../socket.ts";

export const takeReward = () => {
  socket.emit("take-reward");
};
