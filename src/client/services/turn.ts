import { socket } from "../socket.ts";
import {
  EnemyClientTurnType,
  PlayerTurnType,
} from "../../types/events/turn.ts";

export const playerTurn = (turn: PlayerTurnType) => {
  socket.emit("player-turn", turn);
};

export const enemyTurn = (turn: EnemyClientTurnType) => {
  socket.emit("enemy-turn", turn);
};
