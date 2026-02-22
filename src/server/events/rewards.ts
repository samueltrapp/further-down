import { sendGame } from "../meta/gameManagement.ts";
import { ConnectionType, VoteType } from "../../types/server.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";
import { LobbyStatus } from "../../types/game.ts";
import { randomizeCollection } from "../utils/character.ts";
import { SingleRewardType } from "../../types/equipables/aggregates.ts";
import { pickEnemies, setBlankBattle } from "../battle/generator.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ArmorName } from "../../types/equipables/armors.ts";

export function submitName(
  connection: ConnectionType,
  { name, gameId, characterId }: SetNameType,
) {
  const game = connection.meta.games.get(gameId);
  if (game && game.characters) {
    /* Update character name */
    const character = game.characters?.[characterId];
    character.name = name;
    game.characters[characterId] = character;

    /* Update game with character changes */
    const updatedGame = {
      ...game,
      characters: game.characters,
    };

    connection.meta.games.set(gameId, updatedGame);
    sendGame(connection, gameId);
  }
}

export function takeReward(
  connection: ConnectionType,
  { rewardType, rewardName, gameId, characterId }: TakeRewardType,
) {
  const game = connection.meta.games.get(gameId);
  if (game && game.characters) {
    const character = game.characters[characterId] as PlayerType | undefined;

    if (character && character.team === "player") {
      const reducedQueue = character.rewards.queue[rewardType].filter(
        (queueItem) => queueItem !== rewardName,
      ) as SingleRewardType;

      /* Add chosen reward to character and reshuffle remaining options */
      // @ts-ignore
      character.rewards.owned[rewardType].push(rewardName);

      /* Auto-equip weapon if currently unarmed */
      if (
        rewardType === "weapons" &&
        character.rewards.equippedWeapon === null
      ) {
        character.rewards.equippedWeapon = rewardName as WeaponName;
      } else if (rewardType === "armors") {
        /* Auto-equip any armor as soon as it's acquired */
        character.rewards.equippedArmor = rewardName as ArmorName;
      }
      // @ts-ignore
      character.rewards.queue[rewardType] = randomizeCollection(reducedQueue);
      character.rewards.pending[rewardType] =
        character.rewards.pending[rewardType] - 1;

      /* Update character */
      game.characters[characterId] = character;

      /* Update game */
      const newGameState = {
        ...game,
        characters: game.characters,
      };
      connection.meta.games.set(gameId, newGameState);
      sendGame(connection, gameId);
    }
  }
}

export function takeStats(
  connection: ConnectionType,
  { newStats, gameId, characterId }: TakeStatsType,
) {
  const game = connection.meta.games.get(gameId);
  if (game && game.characters) {
    const character = game.characters[characterId] as PlayerType | undefined;

    if (character && character.team === "player") {
      character.stats = newStats;
      character.rewards.pending.stats = 0;

      const newGameState = {
        ...game,
        characters: game.characters,
      };
      connection.meta.games.set(gameId, newGameState);
      sendGame(connection, gameId);
    }
  }
}

export function finishSkilling(
  connection: ConnectionType,
  { gameId, userId }: VoteType,
) {
  const game = connection.meta.games.get(gameId);
  if (game) {
    const votes = [...game.lobby.votes];
    const alreadyVoted = votes.includes(userId);
    const totalVotes = alreadyVoted ? votes : [...votes, userId];
    const votedToAdvance = totalVotes.length === game.lobby.users.length;

    let battle = game.battle;
    const characters = game.characters;
    if (votedToAdvance && characters) {
      const enemies = pickEnemies();
      enemies.forEach((enemy) => {
        characters[enemy[0]] = enemy[1];
      });
      battle = setBlankBattle(characters);
    }

    const newGameState = {
      ...game,
      battle,
      characters,
      lobby: {
        ...game.lobby,
        votes: votedToAdvance ? [] : totalVotes,
        status: votedToAdvance ? LobbyStatus.BATTLE : game.lobby.status,
      },
    };
    connection.meta.games.set(gameId, newGameState);
    sendGame(connection, gameId);
  }
}
