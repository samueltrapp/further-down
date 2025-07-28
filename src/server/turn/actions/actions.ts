import { CharType } from "../../../types/characters.ts";
import { getCharacterDetails } from "../utils/data.ts";
import { TurnType } from "../../../types/game.ts";
import { getMnvFns } from "../mnvFnMap.ts";

export function resolveAction(
  characters: CharType[],
  logMessages: string[],
  turn: TurnType,
) {
  const { maneuver } = turn;
  const mnvFns = getMnvFns(maneuver);
  const { actor, recipients } = getCharacterDetails(characters, turn);
  const characterResults = [...characters];

  // Process updates to and logs from the issuer
  const [actorValue, actorIndex] = actor;
  const selfResults = mnvFns?.self({ self: actorValue, maneuver });
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
