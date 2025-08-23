import { GameType, LobbyStatusType } from "../../types/game.ts";
import { Server } from "socket.io";

export const existingLobby = (
  io: Server,
  game: GameType | undefined,
  userId: string,
): GameType | undefined => {
  const playerAlreadyInGame = game?.lobby?.players.some(
    (player) => player === userId,
  );

  if (game && game.lobby.players.length <= 3 && !playerAlreadyInGame) {
    return {
      ...game,
      lobby: {
        ...game.lobby,
        status: (game.lobby.players.length === 3
          ? "full"
          : "waiting") as LobbyStatusType,
        players: [...game.lobby.players, userId],
      },
    };
  } else if (!game) {
    io.to(userId).emit("rejectPlayer", "Couldn't find game.");
  } else {
    io.to(userId).emit("rejectPlayer", "Room is full.");
  }

  return undefined;
};
