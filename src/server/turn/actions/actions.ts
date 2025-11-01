import { getCharacterDetails } from "../utils/data.ts";
import { getMnvFn } from "../../lib/maneuvers/fnMap.ts";
import {
  EnemyServerTurnType,
  PlayerTurnType,
} from "../../../types/events/turn.ts";
import { CharactersType } from "../../../types/game.ts";

export function resolveManeuver(
  characters: CharactersType,
  logMessages: string[],
  turn: PlayerTurnType,
) {
  const { maneuver, weapon } = turn;
  const mnvFn = getMnvFn(maneuver);
  const { source, targets } = getCharacterDetails(characters, turn);
  const characterResults = { ...characters };

  // const [actorValue, actorIndex] = source;
  // const selfResults = mnvFn({ self: actorValue, maneuver, weapon });
  // const updatedSelf = {
  //   value: selfResults?.character || actorValue,
  //   index: actorIndex,
  // };
  //
  // const updatedRecipients = targets.map((recipient) => {
  //   const [recipientValue, recipientIndex] = recipient;
  //   const recipientResult = mnvFn?.other({
  //     recipient: recipientValue,
  //     actor: actorValue,
  //     maneuver,
  //     weapon,
  //   });
  //
  //   if (
  //     recipientResult?.logMessages &&
  //     recipientResult?.logMessages.length > 0
  //   ) {
  //     recipientResult.logMessages.forEach((logMessage) =>
  //       logMessages.push(logMessage),
  //     );
  //   }
  //
  //   return {
  //     value: recipientResult?.character || recipientValue,
  //     index: recipientIndex,
  //   };
  // });
  //
  // characterResults.players[updatedSelf.index] = updatedSelf.value;
  // updatedRecipients.forEach((recipient) => {
  //   characterResults.enemies[recipient.index] = recipient.value;
  // });
  //
  // if (selfResults?.logMessages && selfResults?.logMessages.length > 0) {
  //   selfResults.logMessages.forEach((logMessage) =>
  //     logMessages.push(logMessage),
  //   );
  // }

  return { characters: characterResults, logMessages };
}

export function resolveTactic(
  characters: CharactersType,
  logMessages: string[],
  turn: EnemyServerTurnType,
) {
  console.log(turn.tactic);

  return {
    characters,
    logMessages,
  };
}
