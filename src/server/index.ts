import * as http from "http";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { initializeLobby } from "./utils/initialData.ts";
import { EnemyTurnType, GameMetaType, PlayerTurnType } from "../types/game.ts";
import { resolveEnemyTurn, resolvePlayerTurn } from "./events/turn.ts";
import { existingLobby } from "./menus/lobby.ts";
import { randomId } from "./utils/data.ts";
import { updateCharacter } from "./events/exploration.ts";
import { CharType } from "../types/individual/characters.ts";

type JoinDataType = {
  gameId: string;
  userId: string;
};

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
  function createGame(userId: string) {
    const newGameId = randomId();
    socket.join(newGameId);
    gameMeta.games.push(initializeLobby(newGameId, userId));
    sendGame(newGameId);
  }

  function joinGame({ gameId, userId }: JoinDataType) {
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    socket.join(userId);
    const joinResponse = existingLobby(io, game, userId);
    if (joinResponse) {
      const updatedGame = joinResponse;
      socket.join(gameId);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId);
    }
  }

  function vote({
    gameId,
    voteToStart,
  }: {
    gameId: string;
    voteToStart: boolean;
  }) {
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (game) {
      const totalVotes = game.lobby.startVotes + (voteToStart ? 1 : -1);
      gameMeta.games[gameIndex] = {
        ...game,
        lobby: {
          ...game.lobby,
          status:
            totalVotes === game.lobby.players.length
              ? "char-create"
              : game.lobby.status,
          startVotes: totalVotes,
        },
      };
    }
    sendGame(gameId);
  }

  function postCharacter({
    gameId,
    character,
  }: {
    gameId: string;
    character: CharType;
  }) {
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (game) {
      gameMeta.games[gameIndex] = updateCharacter(character, game);
      sendGame(gameId);
    }
  }

  function playerTurn(turn: PlayerTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && game) {
      const { game: updatedGame, logMessages } = resolvePlayerTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function enemyTurn(turn: EnemyTurnType) {
    const gameId = turn.gameId;
    const [game, gameIndex] = gameMeta.findGameAndIndex(gameId);
    if (gameMeta && game) {
      const { game: updatedGame, logMessages } = resolveEnemyTurn(turn, game);
      gameMeta.games[gameIndex] = updatedGame;
      sendGame(gameId, logMessages);
    }
  }

  function sendGame(gameId: string, logMessages?: string[]) {
    const [selectedGame] = gameMeta.findGameAndIndex(gameId);
    if (selectedGame?.lobby?.gameId) {
      io.to(selectedGame?.lobby?.gameId).emit("update", {
        game: selectedGame,
        logMessages,
      });
    }
  }

  // Lobby events
  socket.on("create", (userId: string) => createGame(userId));
  socket.on("join", (joinData: JoinDataType) => joinGame(joinData));
  socket.on("load", (gameId: string) => sendGame(gameId));
  socket.on("vote", (startVote) => vote(startVote));

  // Exploration events
  socket.on("skill", (character) => postCharacter(character));

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
