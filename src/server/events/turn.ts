import {BattleType, CharactersType, GameType} from "../../types/game.ts";
import { resolveManeuver, resolveTactic } from "../turn/actions/actions.ts";
import { resolveTurnOrder } from "../utils/turnOrder.ts";
import {
  EnemyClientTurnType,
  EnemyServerTurnType,
  PlayerTurnType,
} from "../../types/events/turn.ts";
import { random } from "../../common/utils.ts";

function finishTurn(characters: CharactersType, game: GameType, logMessages: string[])  {
  const arePlayersDone = Object.values(characters.players).every(
    (character) => character.stats.speed <= 0,
  );
  const areEnemiesDone = Object.values(characters.enemies).every(
    (character) => character.stats.speed <= 0,
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

export function resolvePlayerTurn(
  turn: PlayerTurnType,
  game: GameType,
): { game: GameType; logMessages: string[] } {
  const { characters, logMessages } = resolveManeuver(game.characters, [], turn);

  return finishTurn(characters, game, logMessages);
}

export function resolveEnemyTurn(
  turn: EnemyClientTurnType,
  game: GameType,
): { game: GameType; logMessages: string[] } {
  const tactics = game.characters.enemies[turn.sourceId].tactics;
  const randomTactic = tactics[random(tactics.length)];
  const targetIds = [
    game.characters.players[random(Object.values(game.characters.players).length)].id,
  ];
  const decidedTurn: EnemyServerTurnType = {
    ...turn,
    tactic: randomTactic,
    targetIds,
  };

  const { characters, logMessages } = resolveTactic(game.characters, [], decidedTurn);
  return finishTurn(characters, game, logMessages);
}
