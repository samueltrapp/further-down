import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { resolveEnemyTurn, resolvePlayerTurn } from "./events/turn.ts";
import { takeReward } from "./events/rewards.ts";
import { EnemyTurnType, PlayerTurnType } from "../types/events/turn.ts";
import { GameMetaType, JoinDataType, VoteType } from "../types/server.ts";
import {
  createGame,
  joinGame,
  sendGame,
  vote,
} from "./events/gameManagement.ts";
import { SkillType } from "../types/events/skill.ts";

const port = 8080;
const app = express();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const gameMeta: GameMetaType = {
  games: [],
  findGameAndIndex(gameId: string) {
    const gameIndex = this?.games?.findIndex((game) => {
      return game.lobby.gameId === gameId;
    });
    return gameIndex >= 0
      ? [this.games[gameIndex], gameIndex]
      : [undefined, -1];
  },
};

io.on("connection", (socket) => {
  const connection = { gameMeta, io, socket };

  function playerTurn(turn: PlayerTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && game) {
      const { game: updatedGame, logMessages } = resolvePlayerTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(connection, gameId, logMessages);
    }
  }

  function enemyTurn(turn: EnemyTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && game) {
      const { game: updatedGame, logMessages } = resolveEnemyTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(connection, gameId, logMessages);
    }
  }

  socket.on("load", (gameId: string) => sendGame(connection, gameId));

  // Lobby events
  socket.on("create", (userId: string) => createGame(connection, userId));
  socket.on("join", (joinData: JoinDataType) => joinGame(connection, joinData));
  socket.on("vote", (startVote: VoteType) => vote(connection, startVote));

  // Exploration events
  socket.on("take-reward", (skill: SkillType) => takeReward(connection, skill));

  // Battle events
  socket.on("playerTurn", (turn) => playerTurn(turn));
  socket.on("enemyTurn", (turn) => enemyTurn(turn));
});

server.on("error", (e) => {
  console.error(e);
});

server.listen(port, () => {
  console.log(`Ready at ${port}`);
});
