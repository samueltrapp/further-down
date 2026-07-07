import { sendGame } from "../meta/gameManagement.ts";
import { ConnectionType, VoteType } from "../../types/server.ts";
import {
  SetNameType,
  TakeRewardType,
  TakeStatsType,
} from "../../types/events/skill.ts";
import { GameType, LobbyStatus } from "../../types/game.ts";
import { randomizeCollection } from "../utils/character.ts";
import { pickEnemies, setBlankBattle } from "../battle/generator.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ArmorName } from "../../types/equipables/armors.ts";
import { EnchantmentName } from "../../types/equipables/enchantments.ts";
import { ManeuverName } from "../../types/equipables/maneuvers.ts";
import { checkNextTurn } from "../battle/core.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import {BlessingName} from "../../types/equipables/blessings.ts";

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
    const character = { ...game.characters[characterId] };

    if (character && character.team === "player") {
      const reducedQueue = character.private.queue[rewardType].filter(
        (queueItem) => queueItem !== rewardName,
      );

      /* Add chosen reward to character */
      if (rewardType === "armors") {
        character.loadout.armors.push(rewardName as ArmorName);
        character.private.queue.armors = randomizeCollection(
          reducedQueue as ArmorName[],
        ) as ArmorName[];
      } else if (rewardType === "blessings") {
       character.loadout.blessings.push(rewardName as BlessingName);
      } else if (rewardType === "enchantments") {
        character.loadout.enchantments.push({
          name: rewardName as EnchantmentName,
          socket: null,
        });
        character.private.queue.enchantments = randomizeCollection(
          reducedQueue as EnchantmentName[],
        ) as EnchantmentName[];
      } else if (rewardType === "maneuvers") {
        character.loadout.maneuvers.push(rewardName as ManeuverName);
        character.private.queue.maneuvers = randomizeCollection(
          reducedQueue as ManeuverName[],
        ) as ManeuverName[];
      } else if (rewardType === "weapons") {
        character.loadout.weapons.push(rewardName as WeaponName);
        character.private.queue.weapons = randomizeCollection(
          reducedQueue as WeaponName[],
        ) as WeaponName[];
      }
      character.pending[rewardType]--;

      /* Update game */
      game.characters[characterId] = character;
      connection.meta.games.set(gameId, game);
      sendGame(connection, gameId);
    }
  }
}

export function takeStats(
  connection: ConnectionType,
  { newStats, category, gameId, characterId }: TakeStatsType,
) {
  const game = connection.meta.games.get(gameId);
  if (game && game.characters) {
    const character = { ...game.characters[characterId] };

    if (character && character.team === "player") {
      character.stats = newStats;
      character.pending[category] = 0;

      const newGameState = {
        ...game,
        characters: {
          ...game.characters,
          [characterId]: character,
        },
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
    const enemiesExist = Object.values(game?.characters || {}).some(
      (char) => char.team === "enemy",
    ); // TODO: Move enemy set-up

    let battle = game.battle ? { ...game.battle } : null;
    const characters = { ...game.characters };
    if (votedToAdvance && characters && !enemiesExist) {
      const enemies = pickEnemies();
      enemies.forEach((enemy) => {
        characters[enemy[0]] = enemy[1];
      });
      battle = setBlankBattle(characters);
    }

    /* Skip preparation if all player characters already have prepare cleared. */
    const allPrepared = Object.values(characters).every(
      (char) =>
        char.team !== "player" || (char as PlayerType).pending.prepare === 0,
    );

    const newGameState: GameType = {
      ...game,
      battle,
      characters,
      lobby: {
        ...game.lobby,
        votes: votedToAdvance ? [] : totalVotes,
        status: votedToAdvance
          ? allPrepared
            ? LobbyStatus.BATTLE
            : LobbyStatus.PREPARE
          : game.lobby.status,
      },
    };
    connection.meta.games.set(gameId, newGameState);
    sendGame(connection, gameId);

    /* Immediately go if an enemy has the first turn */
    checkNextTurn(connection, gameId, 5000); // TODO: Better delayed start
  }
}
