import { randomId } from "../utils/data.ts";
import { initializeCharacters, initializeLobby } from "../utils/initialData.ts";
import { ConnectionType, JoinDataType, VoteType } from "../../types/server.ts";
import { existingLobby } from "../menus/lobby.ts";
import { LobbyStatus } from "../../types/game.ts";

export function createGame(connection: ConnectionType, userId: string) {
  const newGameId = randomId();
  connection.socket.join(newGameId);
  connection.gameMeta.games.push(initializeLobby(newGameId, userId));
  sendGame(connection, newGameId);
}

export function joinGame(
  connection: ConnectionType,
  { gameId, userId }: JoinDataType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  connection.socket.join(userId);
  const joinResponse = existingLobby(connection.io, game, userId);
  if (joinResponse) {
    const updatedGame = joinResponse;
    connection.socket.join(gameId);
    connection.gameMeta.games[gameIndex] = updatedGame;
    sendGame(connection, gameId);
  }
}

export function sendGame(
  { gameMeta, socket, io }: ConnectionType,
  gameId: string,
  logMessages?: string[],
) {
  const [selectedGame] = gameMeta.findGameAndIndex(gameId);
  if (selectedGame?.lobby?.gameId) {
    socket.join(gameId);
    io.to(selectedGame?.lobby?.gameId).emit("update", {
      game: selectedGame,
      logMessages,
    });
  }
}

export function startVote(
  connection: ConnectionType,
  { gameId, vote }: VoteType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const totalVotes = game.lobby.votes + (vote ? 1 : -1);
    const votedToStart = totalVotes === game.lobby.users.length;

    const playerCharacters = votedToStart
      ? initializeCharacters(game)
      : game.characters.players;
    const lobbyStatus = votedToStart ? LobbyStatus.REWARD : game.lobby.status;

    connection.gameMeta.games[gameIndex] = {
      ...game,
      characters: {
        ...game.characters,
        players: playerCharacters,
      },
      lobby: {
        ...game.lobby,
        status: lobbyStatus,
        votes: votedToStart ? 0 : totalVotes,
      },
    };
  }
  sendGame(connection, gameId);
}
