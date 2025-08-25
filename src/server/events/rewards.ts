import {
  PlayerType,
  RewardOptions,
} from "../../types/individual/characters.ts";
import { sendGame } from "./gameManagement.ts";
import { ConnectionType } from "../../types/server.ts";

export function updateCharacter(
  connection: ConnectionType,
  {
    gameId,
    rewardSlot,
    character,
  }: {
    gameId: string;
    rewardSlot: RewardOptions;
    character: PlayerType;
  },
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const existingCharacters = game.characters.players;
    const characterToOverride = existingCharacters.findIndex(
      (existingCharacter) => existingCharacter.id === character.id,
    );

    if (characterToOverride >= 0) {
      existingCharacters[characterToOverride] = character;
      game.characters.players[characterToOverride].pendingRewards[rewardSlot] =
        0;
    }
    connection.gameMeta.games[gameIndex] = game;
    sendGame(connection, gameId);
  }
}
