import { GameType, PlayerTurnType } from "../../types/game.ts";
import { resolvePreActions } from "./actions/preActions.ts";
import { resolveAction } from "./actions/actions.ts";
import { resolvePostActions } from "./actions/postActions.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";

export function resolveTurn(
  turn: PlayerTurnType,
  game: GameType,
): { game: GameType; logMessages: string[] } {
  let { characters, logMessages } = resolvePreActions(game.characters);
  ({ characters, logMessages } = resolveAction(characters, logMessages, turn));
  ({ characters, logMessages } = resolvePostActions(characters, logMessages));

  const isRoundEnd = !characters.some((character) => character.stats.speed > 0);

  return {
    game: {
      ...game,
      characters,
      round: isRoundEnd ? game.round : game.round + 1,
      turnNumber: game.turnNumber + 1,
      turnOrder: resolveTurnOrder(characters),
    },
    logMessages,
  };
}
