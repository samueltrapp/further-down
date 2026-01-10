import { GameType } from "./game.ts";
import { Server, Socket } from "socket.io";

export type ConnectionType = {
  meta: MetaType;
  io: Server;
  socket: Socket;
};

export type MetaType = {
  games: Map<string, GameType>;
};

export type JoinDataType = {
  gameId: string;
  userId: string;
};

export type VoteType = {
  gameId: string;
  vote: boolean;
  userId: string;
};
