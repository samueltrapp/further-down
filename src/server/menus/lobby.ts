import { GameType } from "../../types/game.ts";
import { Server } from "socket.io";

export const existingLobby = (
  io: Server,
  game: GameType | undefined,
): [GameType | undefined, string[]] => {
  if (game && game.playerCount <= 4) {
    io.emit("addPlayer", game.playerCount);
    const updatedGame = {
      ...game,
      players: game.playerCount + 1,
    };
    return [updatedGame, [`A player joined the room (${game.playerCount}/4)!`]];
  } else if (!game) {
    io.emit("rejectPlayer", "Can't find game.");
  } else {
    io.emit("rejectPlayer", "Room is full.");
  }
  return [game, [""]];
};
