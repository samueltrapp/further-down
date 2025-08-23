import { EnemyTurnType, GameType, PlayerTurnType } from "../../types/game.ts";
import { resolvePreActions } from "../turn/actions/preActions.ts";
import { resolveManeuver, resolveTactic } from "../turn/actions/actions.ts";
import { resolvePostActions } from "../turn/actions/postActions.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";

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

  const isRoundEnd = !characters.some((character) => character.stats.speed > 0);

  return {
    game: {
      ...game,
      battle: {
        round: isRoundEnd ? game.battle?.round : game.battle?.round + 1,
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

  const isRoundEnd = !characters.some((character) => character.stats.speed > 0);

  return {
    game: {
      ...game,
      battle: {
        ...game,
        round: isRoundEnd ? game.battle?.round : game.battle?.round + 1,
        turnOrder: resolveTurnOrder(characters),
      },
      characters,
    },
    logMessages,
  };
}
