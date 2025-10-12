import {EnemyClientTurnType, PlayerTurnType} from "../../types/events/turn.ts";
import {resolveEnemyTurn, resolvePlayerTurn} from "../events/turn.ts";
import {sendGame} from "./gameManagement.ts";
import {ConnectionType} from "../../types/server.ts";

export function takePlayerTurn(
  connection: ConnectionType,
  turn: PlayerTurnType
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(turn.gameId);
  if (game) {
    const { game: updatedGame, logMessages } = resolvePlayerTurn(turn, game);
    connection.gameMeta.games[gameIndex] = updatedGame;
    sendGame(connection, turn.gameId, logMessages);
  }
}

export function takeEnemyTurn(
  connection: ConnectionType,
  turn: EnemyClientTurnType
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(turn.gameId);
  if (game) {
    const { game: updatedGame, logMessages } = resolveEnemyTurn(turn, game);
    connection.gameMeta.games[gameIndex] = updatedGame;
    sendGame(connection, turn.gameId, logMessages);
  }
}