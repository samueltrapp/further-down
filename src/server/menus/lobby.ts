import { GameType, LobbyStatus } from "../../types/game.ts";
import { Server } from "socket.io";

export const existingLobby = (
  io: Server,
  game: GameType | undefined,
  userId: string,
): GameType | undefined => {
  const playerAlreadyInGame = game?.lobby?.users.some(
    (player) => player === userId,
  );

  if (game && game.lobby.users.length <= 3 && !playerAlreadyInGame) {
    return {
      ...game,
      lobby: {
        ...game.lobby,
        status:
          game.lobby.users.length === 3
            ? LobbyStatus.FULL
            : LobbyStatus.WAITING,
        users: [...game.lobby.users, userId],
      },
    };
  } else if (!game) {
    io.to(userId).emit("rejectPlayer", "Couldn't find game.");
  } else {
    io.to(userId).emit("rejectPlayer", "Room is full.");
  }

  return undefined;
};
