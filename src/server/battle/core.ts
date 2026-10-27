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

/* Mark characters with 0 Life as dead */
export const applyDeath = (ctx: ActionCtx) => {
  const { characters } = ctx;

  for (const character of Object.values(characters)) {
    if (!character.isDead && character.stats.core.life <= 0) {
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
  loadDelay: number = 0,
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
          loadDelay,
        );
      }
    }
  }
};

export const checkRoundEnd = (ctx: ActionCtx) => {
  const { characters } = ctx;
  return Object.values(characters).every(
    (character) => character.isDead || character.stats.core.speed <= 0,
  );
};

export const checkBattleEnd = (ctx: ActionCtx) => {
  const { characters } = ctx;

  /* Check end of turn statuses */
  let areEnemiesDead = true,
    arePlayersDead = true;

  for (const characterId in characters) {
    const character = characters[characterId];

    /* End early if both statuses are already known */
    if (!areEnemiesDead && !arePlayersDead) {
      break;
    }
    if (character.isDead) {
      continue;
    }
    if (character.team === "enemy") {
      areEnemiesDead = false;
    }
    if (character.team === "player") {
      arePlayersDead = false;
    }
  }

  if (areEnemiesDead && !arePlayersDead) {
    return Victor.PLAYER;
  } else if (arePlayersDead) {
    return Victor.ENEMY;
  } else {
    return Victor.NONE;
  }
};

/* Apply changes at end of turn */
export const finishTurn = (
  game: GameType,
  characters: CharactersType,
  isRoundEnd: boolean,
  messages: TurnLog,
  victor: Victor,
): GameType => {
  if (!game.characters || !game.battle) {
    return game;
  }

  const separatedMessages = game.battle.messages;
  separatedMessages.push(messages);
  if (victor === Victor.PLAYER) {
    separatedMessages.push({ headline: "VICTORY" });
  } else if (victor === Victor.ENEMY) {
    separatedMessages.push({ headline: "DEFEAT" });
  } else if (isRoundEnd) {
    separatedMessages.push({ headline: `END OF ROUND ${game.battle.round}` });
  }

  /* Create new game state */
  return {
    ...game,
    battle: {
      ...(game.battle as BattleType),
      isFresh: false,
      messages: separatedMessages,
      round: resolveRoundCount(game.battle.round, isRoundEnd),
      turnOrder: resolveTurnOrder(game.characters),
      victor,
    },
    characters,
  };
};
