import {socket} from "../utils/socket.ts";
import {TurnType} from "../../types/game.ts";

export const turn = (turn: TurnType) => {
  socket.emit('turn', turn);
};