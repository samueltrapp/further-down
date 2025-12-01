import { sendGame } from "../meta/gameManagement.ts";
import { ConnectionType, VoteType } from "../../types/server.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";
import { CharactersType, LobbyStatus } from "../../types/game.ts";
import { randomizeCollection } from "../utils/data.ts";
import { SingleRewardType } from "../../types/equipables/aggregates.ts";
import { pickEnemies, setBlankBattle } from "../battle/generator.ts";

export function submitName(
  connection: ConnectionType,
  { name, gameId, characterId }: SetNameType,
) {
  const [game, gameIndex] = connection.gameMeta.findGameAndIndex(gameId);
  if (game) {
    const character = game.characters.players[characterId];

    if (character) {
      character.name = name;

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: {
            ...game.characters.players,
            [characterId]: character,
          },
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
    const character = game.characters.players[characterId];

    if (character) {
      const reducedQueue = character.rewards.queue[rewardOption].filter(
        (queueItem) => queueItem.name !== rewardName,
      ) as SingleRewardType;
      const selectedReward = character.rewards.queue[rewardOption].find(
        (reward) => reward.name === rewardName,
      );

      // @ts-ignore
      character.rewards.owned[rewardOption].push(selectedReward);
      // @ts-ignore
      character.rewards.queue[rewardOption] = randomizeCollection(reducedQueue);
      character.rewards.pending[rewardOption] =
        character.rewards.pending[rewardOption] - 1;

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: {
            ...game.characters.players,
            [characterId]: character,
          },
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
    const character = game.characters.players[characterId];

    if (character) {
      character.stats = newStats;
      character.rewards.pending.stats = 0;

      connection.gameMeta.games[gameIndex] = {
        ...game,
        characters: {
          ...game.characters,
          players: {
            ...game.characters.players,
            [characterId]: character,
          },
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
