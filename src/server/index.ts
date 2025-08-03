import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { initializeGame } from "./utils/initialData.ts";
import { EnemyTurnType, GameMetaType, PlayerTurnType } from "../types/game.ts";
import { resolveEnemyTurn, resolvePlayerTurn } from "./turn/turn.ts";
import { existingLobby } from "./menus/lobby.ts";
import { randomId } from "./utils/data.ts";

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
    const gameIndex = this?.games?.findIndex((game) => game.gameId === gameId);
    return gameIndex >= 0
      ? [this.games[gameIndex], gameIndex]
      : [undefined, -1];
  },
};

io.on("connection", (socket) => {
  function createGame() {
    const newGameId = randomId();
    socket.join(newGameId);
    gameMeta.games.push(initializeGame(newGameId));
    sendGame(newGameId);
  }

  function joinGame(roomCode: string) {
    const [game, gameIndex] = gameMeta.findGameAndIndex(roomCode);
    const [updatedGame, logMessages] = existingLobby(io, game);
    if (updatedGame) {
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(roomCode, logMessages);
    }
  }

  function playerTurn(turn: PlayerTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && gameIndex && game) {
      const { game: updatedGame, logMessages } = resolvePlayerTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function enemyTurn(turn: EnemyTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && gameIndex && game) {
      const { game: updatedGame, logMessages } = resolveEnemyTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function sendGame(gameId: string, logMessages?: string[]) {
    const [selectedGame] = gameMeta.findGameAndIndex(gameId);
    if (selectedGame?.gameId) {
      io.to(selectedGame?.gameId).emit("update", {
        game: selectedGame,
        logMessages,
      });
    }
  }

  socket.on("create", createGame);
  socket.on("join", (roomCode) => joinGame(roomCode));
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
