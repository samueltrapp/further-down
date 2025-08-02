import { socket } from "./socket.ts";
import { EnemyTurnType, PlayerTurnType } from "../../types/game.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("playerTurn", turn);
};

export const enemyTurn = (turn: EnemyTurnType) => {
  socket.emit("enemyTurn", turn);
};
