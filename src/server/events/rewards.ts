import { sendGame } from "./gameManagement.ts";
import { ConnectionType, VoteType } from "../../types/server.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { GameType, LobbyStatus } from "../../types/game.ts";

const findCharacter = (game: GameType, characterId: string) =>
  game.characters.players.findIndex(
    (existingCharacter) => existingCharacter.id === characterId,
  );

export function submitName(
  connection: ConnectionType,
  { name, gameId, characterId }: SetNameType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const characterIndex = findCharacter(game, characterId);

    if (characterIndex >= 0) {
      const character = game.characters.players[characterIndex];
      const updatedCharacter = {
        ...character,
        name,
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

export function takeReward(
  connection: ConnectionType,
  { rewardOption, rewardName, gameId, characterId }: TakeRewardType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const characterIndex = findCharacter(game, characterId);

    if (characterIndex >= 0) {
      const character = game.characters.players[characterIndex];
      const reducedQueue = character.rewards.queue[rewardOption].filter(
        (queueItem) => queueItem.name !== rewardName,
      );

      const updatedCharacter: PlayerType = {
        ...character,
        rewards: {
          owned: {
            ...character.rewards.owned,
            [rewardOption]: [
              ...character.rewards.owned[rewardOption],
              rewardName,
            ],
          },
          queue: {
            ...character.rewards.queue,
            [rewardOption]: reducedQueue,
          },
          pending: {
            ...character.rewards.pending,
            [rewardOption]: character.rewards.pending[rewardOption] - 1,
          },
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
        rewards: {
          ...character.rewards,
          pending: {
            ...character.rewards.pending,
            stats: 0,
          },
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

export function finishSkilling(
  connection: ConnectionType,
  { gameId }: VoteType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const totalVotes = game.lobby.votes + 1;
    const votedToAdvance = totalVotes === game.lobby.users.length;

    connection.gameMeta.games[gameIndex] = {
      ...game,
      lobby: {
        ...game.lobby,
        votes: votedToAdvance ? 0 : totalVotes,
        status: votedToAdvance ? LobbyStatus.BATTLE : game.lobby.status,
      },
    };
    sendGame(connection, gameId);
  }
}
