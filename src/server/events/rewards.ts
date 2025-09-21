import { sendGame } from "./gameManagement.ts";
import { ConnectionType, VoteType } from "../../types/server.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { CharactersType, GameType, LobbyStatus } from "../../types/game.ts";
import { randomizeCollection } from "../utils/data.ts";
import { SingleRewardType } from "../../types/equipables/aggregates.ts";
import { pickEnemies, setBlankBattle } from "../battle/generator.ts";

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
      ) as SingleRewardType;
      const selectedReward = character.rewards.queue[rewardOption].find(
        (reward) => reward.name === rewardName,
      );

      const updatedCharacter: PlayerType = {
        ...character,
        rewards: {
          owned: {
            ...character.rewards.owned,
            [rewardOption]: [
              ...character.rewards.owned[rewardOption],
              selectedReward,
            ],
          },
          queue: {
            ...character.rewards.queue,
            [rewardOption]: randomizeCollection(reducedQueue),
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
  { gameId, userId }: VoteType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const votes = [...game.lobby.votes];
    const alreadyVoted = votes.includes(userId);
    const totalVotes = alreadyVoted ? votes : [...votes, userId];
    const votedToAdvance = totalVotes.length === game.lobby.users.length;

    let battle = game.battle;
    let characters: CharactersType = game.characters;
    if (votedToAdvance) {
      const enemies = pickEnemies();
      characters = {
        ...characters,
        enemies,
      };
      battle = setBlankBattle(characters);
    }

    connection.gameMeta.games[gameIndex] = {
      ...game,
      battle,
      characters,
      lobby: {
        ...game.lobby,
        votes: votedToAdvance ? [] : totalVotes,
        status: votedToAdvance ? LobbyStatus.BATTLE : game.lobby.status,
      },
    };
    sendGame(connection, gameId);
  }
}
