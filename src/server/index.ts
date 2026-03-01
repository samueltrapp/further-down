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
import { PlayerTurnType } from "../types/events/turn.ts";
import { JoinDataType, MetaType, VoteType } from "../types/server.ts";
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
import { handleTurn } from "./meta/turnHandler.ts";
import dotenv from "dotenv";

const port = 8080;
const app = express();
dotenv.config();

app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

const meta: MetaType = {
  games: new Map(),
};

io.on("connection", (socket) => {
  const connection = { meta, io, socket };

  socket.on(
    "game:load",
    ({ gameId, userId }: { gameId: string; userId: string }) => {
      const game = meta.games.get(gameId);
      const characterInGame = game?.lobby.users.some((user) => user === userId);
      if (characterInGame) {
        sendGame(connection, gameId);
      }
    },
  );

  // Lobby events
  socket.on("lobby:create", (userId: string) => createGame(connection, userId));
  socket.on("lobby:join", (joinData: JoinDataType) =>
    joinGame(connection, joinData),
  );
  socket.on("lobby:vote", (votes: VoteType) => startVote(connection, votes));
  socket.on("lobby:skill", (votes: VoteType) =>
    finishSkilling(connection, votes),
  );

  // Exploration events
  socket.on("char:name", (name: SetNameType) => submitName(connection, name));
  socket.on("char:reward", (skill: TakeRewardType) =>
    takeReward(connection, skill),
  );
  socket.on("char:skill", (stats: TakeStatsType) =>
    takeStats(connection, stats),
  );

  // Battle events
  socket.on("action:player", (turn: PlayerTurnType) =>
    handleTurn(connection, turn),
  );
});

server.on("error", (e) => {
  console.error(e);
});

server.listen(port, () => {
  console.log(`Ready at ${port}`);
});
