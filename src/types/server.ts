import { GameType } from "./game.ts";
import { Server, Socket } from "socket.io";

export type ConnectionType = {
  gameMeta: GameMetaType;
  io: Server;
  socket: Socket;
};

export type GameMetaType = {
  games: GameType[];
  findGameAndIndex: (gameId: string) => [GameType | undefined, number];
};

export type JoinDataType = {
  gameId: string;
  userId: string;
};

export type VoteType = {
  gameId: string;
  vote: boolean;
};
