import {MnvOrTctFnType} from "../../../../types/events/turn.ts";
import {tacticCollection} from "../collection.ts";


export function bonkFn({characters, sourceId, targetIds}: MnvOrTctFnType) {
  const tctDetail = tacticCollection.bonk;
  const source = characters.enemies[sourceId];
  const targets = targetIds.map(targetId => characters.players[targetId]);


  const logMessages: string[] = [];

  return {
    characters,
    logMessages
  }
}