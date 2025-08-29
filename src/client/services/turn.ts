import { socket } from "../socket.ts";
import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("playerTurn", turn);
};

export const enemyTurn = (turn: EnemyTurnType) => {
  socket.emit("enemyTurn", turn);
};
