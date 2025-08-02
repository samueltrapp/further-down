import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { initializeGame } from "./utils/initialData.ts";
import { v4 as uuidv4 } from "uuid";
import { EnemyTurnType, GameMetaType, PlayerTurnType } from "../types/game.ts";
import { resolveEnemyTurn, resolvePlayerTurn } from "./turn/turn.ts";

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
  findGame(gameId: string) {
    return this?.games?.find((game) => game.gameId === gameId);
  },
  findGameIndex(gameId: string) {
    return this?.games?.findIndex((game) => game.gameId === gameId);
  },
};

io.on("connection", (socket) => {
  function createGame() {
    const newGameId = uuidv4();
    gameMeta.games.push(initializeGame(newGameId));
    sendGame(newGameId);
  }

  function playerTurn(turn: PlayerTurnType) {
    const gameId = turn.gameId;
    const gameIndex = gameMeta.findGameIndex(gameId);
    const game = gameIndex && gameMeta.games[gameIndex];
    if (gameMeta && gameIndex && game) {
      const { game: updatedGame, logMessages } = resolvePlayerTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function enemyTurn(turn: EnemyTurnType) {
    const gameId = turn.gameId;
    const gameIndex = gameMeta.findGameIndex(gameId);
    const game = gameIndex && gameMeta.games[gameIndex];
    if (gameMeta && gameIndex && game) {
      const { game: updatedGame, logMessages } = resolveEnemyTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function sendGame(gameId: string, logMessages?: string[]) {
    const selectedGame = gameMeta.findGame(gameId);
    io.emit("update", { game: selectedGame, logMessages });
  }

  socket.on("create", createGame);
  socket.on("load", (gameId) => sendGame(gameId));
  socket.on("playerTurn", (turn) => playerTurn(turn));
  socket.on("enemyTurn", (turn) => enemyTurn(turn));
});

server.on("error", (e) => {
  console.error(e);
});

server.listen(port, () => {
  console.log(`Ready at ${port}`);
});
