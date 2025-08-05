import { GameType, LobbyStatusType } from "../../types/game.ts";
import { Server } from "socket.io";

export const existingLobby = (
  io: Server,
  game: GameType | undefined,
  playerId: string,
): [GameType, string[]] | undefined => {
  const playerAlreadyInGame = game?.lobby?.players.some(
    (player) => player === playerId,
  );
  if (game && game.lobby.players.length <= 3 && !playerAlreadyInGame) {
    const updatedGame = {
      ...game,
      status: (game.lobby.players.length === 3
        ? "full"
        : "waiting") as LobbyStatusType,
      players: [...game.lobby.players, playerId],
    };
    return [
      updatedGame,
      [`A player joined the room (${updatedGame.players.length}/4)!`],
    ];
  } else if (!game) {
    io.to(playerId).emit("rejectPlayer", "Couldn't find game.");
  } else {
    io.to(playerId).emit("rejectPlayer", "Room is full.");
  }

  game?.lobby?.players.forEach((player) => console.log(player));
  return undefined;
};
