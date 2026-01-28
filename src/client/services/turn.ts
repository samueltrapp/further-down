import { socket } from "../socket.ts";
import {
  EnemyClientTurnType,
  PlayerTurnType,
} from "../../types/events/turn.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("action:player", turn);
};

export const enemyTurn = (turn: EnemyClientTurnType) => {
  socket.emit("action:enemy", turn);
};
