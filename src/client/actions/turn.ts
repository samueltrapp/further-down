import {socket} from "../utils/socket.ts";

export const turn = (turn: {maneuver: string, gameId: string, targets: string[]}) => {
  socket.emit('turn', turn);
};