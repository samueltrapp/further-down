import { BattleType, GameType } from "../../types/game.ts";
import { resolvePreActions } from "../turn/actions/preActions.ts";
import { resolveManeuver, resolveTactic } from "../turn/actions/actions.ts";
import { resolvePostActions } from "../turn/actions/postActions.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import { EnemyTurnType, PlayerTurnType } from "../../types/events/turn.ts";

export function resolvePlayerTurn(
  turn: PlayerTurnType,
  game: GameType,
): { game: GameType; logMessages: string[] } {
  let { characters, logMessages } = resolvePreActions(game.characters);
  ({ characters, logMessages } = resolveManeuver(
    characters,
    logMessages,
    turn,
  ));
  ({ characters, logMessages } = resolvePostActions(characters, logMessages));

  const arePlayersDone = !characters.players.some(
    (character) => character.stats.speed > 0,
  );
  const areEnemiesDone = !characters.enemies.some(
    (character) => character.stats.speed > 0,
  );
  const isRoundEnd = arePlayersDone && areEnemiesDone;

  return {
    game: {
      ...game,
      battle: {
        ...(game.battle as BattleType),
        round: isRoundEnd ? game.battle!.round : game.battle!.round + 1,
        turnOrder: resolveTurnOrder(characters),
      },
      characters,
    },
    logMessages,
  };
}

export function resolveEnemyTurn(
  turn: EnemyTurnType,
  game: GameType,
): { game: GameType; logMessages: string[] } {
  let { characters, logMessages } = resolvePreActions(game.characters);
  ({ characters, logMessages } = resolveTactic(characters, logMessages, turn));
  ({ characters, logMessages } = resolvePostActions(characters, logMessages));

  const arePlayersDone = !characters.players.some(
    (character) => character.stats.speed > 0,
  );
  const areEnemiesDone = !characters.enemies.some(
    (character) => character.stats.speed > 0,
  );
  const isRoundEnd = arePlayersDone && areEnemiesDone;

  return {
    game: {
      ...game,
      battle: {
        ...(game.battle as BattleType),
        round: isRoundEnd ? game.battle!.round : game.battle!.round + 1,
        turnOrder: resolveTurnOrder(characters),
      },
      characters,
    },
    logMessages,
  };
}
