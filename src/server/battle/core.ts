import { ActionCtx } from "../../types/events/actionCtx.ts";
import { PlayerType } from "../../types/individual/characters.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";
import { ConnectionType } from "../../types/server.ts";
import { decideEnemyTurn } from "./enemyBehavior.ts";
import {
  BattleType,
  CharactersType,
  GameType,
  TurnLog,
  Victor,
} from "../../types/game.ts";
import { resolveRoundCount, resolveTurnOrder } from "../utils/turnOrder.ts";
import { restoreSpeed } from "./speed.ts";

/* Mark characters with 0 Life as dead */
export const applyDeath = (ctx: ActionCtx) => {
  const { characters } = ctx;

  for (const character of Object.values(characters)) {
    if (!character.isDead && character.stats.life <= 0) {
      character.isDead = true;
      ctx.messages.steps?.push(`${character.name} fell in battle!`);
    }
  }
  return ctx;
};

/* Update character's equipped weapon */
export const switchWeapon = (ctx: ActionCtx, weapon: WeaponName) => {
  const { characters, sourceId } = ctx;
  const source = characters[sourceId] as PlayerType | undefined;
  if (!source) {
    return ctx;
  }

  source.equipped.weapon = weapon;
  return ctx;
};

/* Check if it's now an enemy's turn, generating turn details if it is */
export const checkNextTurn = (
  connection: ConnectionType,
  gameId: string,
  loadDelay?: number,
) => {
  const game = connection.meta.games.get(gameId);
  if (game) {
    const turn = game.battle?.turnOrder[0];
    if (turn) {
      const character = game.characters?.[turn];
      const isEnemyTurn = character?.team === "enemy";
      if (isEnemyTurn && character) {
        setTimeout(
          () => decideEnemyTurn(connection, gameId, game, character.id),
          loadDelay || 0,
        );
      }
    }
  }
};

/* Perform end of turn clean up and checks */
export const finishTurn = (
  game: GameType,
  characters: CharactersType,
  messages: TurnLog,
): GameType => {
  if (!game.characters || !game.battle) {
    return game;
  }

  /* Check end of turn statuses */
  let isRoundEnd = true,
    areEnemiesDead = true,
    arePlayersDead = true;
  for (const character of Object.values(game.characters)) {
    /* End early if all statuses are already known */
    if (!isRoundEnd && !areEnemiesDead && !arePlayersDead) {
      break;
    }
    if (character.stats.speed > 0) {
      isRoundEnd = false;
    }
    if (character.team === "enemy" && !character.isDead) {
      areEnemiesDead = false;
    }
    if (character.team === "player" && !character.isDead) {
      arePlayersDead = false;
    }
  }

  /* Mark winner if one team is defeated */
  const victor = (() => {
    if (areEnemiesDead && !arePlayersDead) {
      messages.steps?.push("PLAYERS WIN.");
      return Victor.PLAYER;
    } else if (arePlayersDead) {
      messages.steps?.push("ENEMIES WIN.");
      return Victor.ENEMY;
    } else return Victor.NONE;
  })();

  const separatedMessages = game.battle.messages;
  separatedMessages.push(messages);

  /* Replenish speed at end of round */
  if (victor === Victor.NONE && isRoundEnd) {
    separatedMessages.push({
      headline: `End of round ${game.battle.round}.`,
    });
    characters = restoreSpeed(characters);
  }

  /* Create new game state */
  return {
    ...game,
    battle: {
      ...(game.battle as BattleType),
      messages: separatedMessages,
      round: resolveRoundCount(game.battle.round, isRoundEnd),
      turnOrder: resolveTurnOrder(game.characters),
      victor,
    },
    characters,
  };
};
