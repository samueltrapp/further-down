import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import {
  finishSkilling,
  submitName,
  takeReward,
  takeStats,
} from "./events/rewards.ts";
import { EnemyClientTurnType, PlayerTurnType } from "../types/events/turn.ts";
import { GameMetaType, JoinDataType, VoteType } from "../types/server.ts";
import {
  createGame,
  joinGame,
  sendGame,
  startVote,
} from "./meta/gameManagement.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../types/events/skill.ts";
import {takeEnemyTurn, takePlayerTurn} from "./meta/turnHandler.ts";

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

  socket.on(
    "load",
    ({ gameId, userId }: { gameId: string; userId: string }) => {
      const [game] = gameMeta.findGameAndIndex(gameId);
      const characterInGame = game?.lobby.users.some((user) => user === userId);
      if (characterInGame) {
        sendGame(connection, gameId);
      }
    },
  );

  // Lobby events
  socket.on("create", (userId: string) => createGame(connection, userId));
  socket.on("join", (joinData: JoinDataType) => joinGame(connection, joinData));
  socket.on("start-vote", (votes: VoteType) => startVote(connection, votes));
  socket.on("finish-skilling", (votes: VoteType) =>
    finishSkilling(connection, votes),
  );

  // Exploration events
  socket.on("submit-name", (name: SetNameType) => submitName(connection, name));
  socket.on("take-reward", (skill: TakeRewardType) =>
    takeReward(connection, skill),
  );
  socket.on("take-stats", (stats: TakeStatsType) =>
    takeStats(connection, stats),
  );

  // Battle events
  socket.on("player-turn", (turn: PlayerTurnType) => takePlayerTurn(connection, turn));
  socket.on("enemy-turn", (turn: EnemyClientTurnType) => takeEnemyTurn(connection, turn));
});

server.on("error", (e) => {
  console.error(e);
});

server.listen(port, () => {
  console.log(`Ready at ${port}`);
});
