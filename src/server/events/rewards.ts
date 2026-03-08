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
import { ManeuverName } from "../../types/equipables/actions.ts";

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
      } else if (rewardType === "enchantments") {
        character.loadout.enchantments.push(rewardName as EnchantmentName);
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
      character.pending[rewardType] = character.pending[rewardType] - 1;

      /* Auto-equip */
      if (rewardType === "weapons" && character.equipped.weapon === null) {
        character.equipped.weapon = rewardName as WeaponName;
      } else if (rewardType === "armors") {
        character.equipped.armor = rewardName as ArmorName;
      }

      /* Update game */
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

export function takeStats(
  connection: ConnectionType,
  { newStats, gameId, characterId }: TakeStatsType,
) {
  const game = connection.meta.games.get(gameId);
  if (game && game.characters) {
    const character = { ...game.characters[characterId] };

    if (character && character.team === "player") {
      character.stats = newStats;
      character.pending.stats = 0;

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

    const newGameState: GameType = {
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
