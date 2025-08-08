import { CharType } from "../../../types/characters.ts";
import { getCharacterDetails } from "../utils/data.ts";
import { EnemyTurnType, PlayerTurnType } from "../../../types/game.ts";
import { getMnvFns } from "../../lib/maneuvers/fnMap.ts";

export function resolveManeuver(
  characters: CharType[],
  logMessages: string[],
  turn: PlayerTurnType,
) {
  const { maneuver, weapon } = turn;
  const mnvFns = getMnvFns(maneuver);
  const { actor, recipients } = getCharacterDetails(characters, turn);
  const characterResults = [...characters];

  // Process updates to and logs from the issuer
  const [actorValue, actorIndex] = actor;
  const selfResults = mnvFns?.self({ self: actorValue, maneuver, weapon });
  const updatedSelf = {
    value: selfResults?.character || actorValue,
    index: actorIndex,
  };

  // Process updates and
  const updatedRecipients = recipients.map((recipient) => {
    const [recipientValue, recipientIndex] = recipient;
    const recipientResult = mnvFns?.other({
      recipient: recipientValue,
      actor: actorValue,
      maneuver,
      weapon,
    });

    if (
      recipientResult?.logMessages &&
      recipientResult?.logMessages.length > 0
    ) {
      recipientResult.logMessages.forEach((logMessage) =>
        logMessages.push(logMessage),
      );
    }

    return {
      value: recipientResult?.character || recipientValue,
      index: recipientIndex,
    };
  });

  characterResults[updatedSelf.index] = updatedSelf.value;
  updatedRecipients.forEach((recipient) => {
    characterResults[recipient.index] = recipient.value;
  });

  if (selfResults?.logMessages && selfResults?.logMessages.length > 0) {
    selfResults.logMessages.forEach((logMessage) =>
      logMessages.push(logMessage),
    );
  }

  return { characters: characterResults, logMessages };
}

export function resolveTactic(
  characters: CharType[],
  logMessages: string[],
  turn: EnemyTurnType,
) {
  console.log(turn);

  return {
    characters,
    logMessages,
  };
}
