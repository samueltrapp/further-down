// import { BattleType, CharactersType, GameType } from "../../types/game.ts";
// import { resolveTurnOrder } from "../utils/turnOrder.ts";
//
// function finishTurn(
//   characters: CharactersType,
//   game: GameType,
//   logMessages: string[],
// ) {
//   const charactersIter = characters.values();
//   // @ts-ignore
//   const isRoundEnd = charactersIter.every(character => character.stats.speed <= 0);
//
//   return {
//     game: {
//       ...game,
//       battle: {
//         ...(game.battle as BattleType),
//         round: isRoundEnd ? game.battle!.round : game.battle!.round + 1,
//         turnOrder: resolveTurnOrder(characters),
//       },
//       characters,
//     },
//     logMessages,
//   };
// }