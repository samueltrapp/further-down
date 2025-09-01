import { sendGame } from "./gameManagement.ts";
import { ConnectionType } from "../../types/server.ts";
import { TakeRewardType, TakeStatsType } from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { GameType } from "../../types/game.ts";

const findCharacter = (game: GameType, characterId: string) =>
  game.characters.players.findIndex(
    (existingCharacter) => existingCharacter.id === characterId,
  );

export function takeReward(
  connection: ConnectionType,
  { rewardOption, rewardName, gameId, characterId }: TakeRewardType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const characterIndex = findCharacter(game, characterId);

    if (characterIndex >= 0) {
      const character = game.characters.players[characterIndex];
      const updatedCharacter: PlayerType = {
        ...character,
        rewards: {
          ...character.rewards,
          [rewardOption]: [...character.rewards[rewardOption], rewardName],
        },
        pendingRewards: {
          ...character.pendingRewards,
          [rewardOption]: character.pendingRewards[rewardOption] - 1,
        },
      };

      /* TS refuses to understand this method even after updating the compiler options */
      // @ts-ignore
      const playerCharacters: PlayerType[] = game.characters.players.toSpliced(
        characterIndex,
        1,
        updatedCharacter,
      );

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: playerCharacters,
        },
      };
      sendGame(connection, gameId);
    }
  }
}

export function takeStats(
  connection: ConnectionType,
  { newStats, gameId, characterId }: TakeStatsType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const characterIndex = findCharacter(game, characterId);

    if (characterIndex >= 0) {
      const character = game.characters.players[characterIndex];
      const updatedCharacter: PlayerType = {
        ...character,
        stats: newStats,
        pendingRewards: {
          ...character.pendingRewards,
          stats: 0,
        },
      };

      /* TS refuses to understand this method even after updating the compiler options */
      // @ts-ignore
      const playerCharacters: PlayerType[] = game.characters.players.toSpliced(
        characterIndex,
        1,
        updatedCharacter,
      );

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: playerCharacters,
        },
      };
      sendGame(connection, gameId);
    }
  }
}
