import { randomId } from "../utils/character.ts";
import { initializeCharacters, initializeLobby } from "../utils/initialData.ts";
import { ConnectionType, JoinDataType, VoteType } from "../../types/server.ts";
import { existingLobby } from "../menus/lobby.ts";
import { GameType, LobbyStatus } from "../../types/game.ts";
import { finishSkilling } from "../events/rewards.ts";

export function createGame(connection: ConnectionType, userId: string) {
  const newGameId = randomId();
  connection.socket.join(newGameId);
  connection.meta.games.set(newGameId, initializeLobby(newGameId, userId));
  sendGame(connection, newGameId);
}

export function joinGame(
  connection: ConnectionType,
  { gameId, userId }: JoinDataType,
) {
  const game = connection.meta.games.get(gameId);
  connection.socket.join(userId);
  const joinResponse = existingLobby(connection.io, game, userId);
  if (joinResponse) {
    const updatedGame = joinResponse;
    connection.socket.join(gameId);
    connection.meta.games.set(gameId, updatedGame);
    sendGame(connection, gameId);
  }
}

export function sendGame({ meta, io }: ConnectionType, gameId: string) {
  const selectedGame = meta.games.get(gameId);
  if (selectedGame?.lobby?.gameId) {
    io.to(selectedGame?.lobby?.gameId).emit("update", { game: selectedGame });
  }
}

export function startVote(
  connection: ConnectionType,
  { gameId, vote, userId }: VoteType,
) {
  const game = connection.meta.games.get(gameId);
  if (game) {
    const totalVotes = vote
      ? [...game.lobby.votes, userId]
      : [...game.lobby.votes].filter((user) => user !== userId);
    const votedToStart = totalVotes.length === game.lobby.users.length;

    const characters = votedToStart
      ? initializeCharacters(game)
      : game.characters;

    // Short-cut character creation
    if (process.env.MOCK_SINGLE_PLAYER === "true") {
      connection.meta.games.set(gameId, <GameType>{ ...game, characters });
      finishSkilling(connection, { gameId, userId });
      return;
    }

    game.lobby.votes = totalVotes;

    if (votedToStart) {
      game.lobby.status = LobbyStatus.REWARD;
      game.lobby.votes = [];
      game.characters = initializeCharacters(game);
    }

    connection.meta.games.set(gameId, game);
  }
  sendGame(connection, gameId);
}
