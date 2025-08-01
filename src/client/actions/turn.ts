import { socket } from "../utils/socket.ts";
import { EnemyTurnType, PlayerTurnType } from "../../types/game.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("turn", turn);
};

export const enemyTurn = (turn: EnemyTurnType) => {
  socket.emit("turn", turn);
};
