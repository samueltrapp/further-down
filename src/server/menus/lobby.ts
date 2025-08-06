import { GameType, LobbyStatusType } from "../../types/game.ts";
import { Server } from "socket.io";

export const existingLobby = (
  io: Server,
  game: GameType | undefined,
  playerId: string,
): GameType | undefined => {
  const playerAlreadyInGame = game?.lobby?.players.some(
    (player) => player === playerId,
  );

  if (game && game.lobby.players.length <= 3 && !playerAlreadyInGame) {
    return {
      ...game,
      lobby: {
        ...game.lobby,
        status: (game.lobby.players.length === 3
          ? "full"
          : "waiting") as LobbyStatusType,
        players: [...game.lobby.players, playerId],
      },
    };
  } else if (!game) {
    io.to(playerId).emit("rejectPlayer", "Couldn't find game.");
  } else {
    io.to(playerId).emit("rejectPlayer", "Room is full.");
  }

  return undefined;
};
