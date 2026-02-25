import { socket } from "../socket.ts";
import { PlayerTurnType } from "../../types/events/turn.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("action:player", turn);
};
