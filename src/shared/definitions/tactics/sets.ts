import {TacticName, TacticType} from "../../../types/equipables/actions.ts";
import {bonk} from "./collection/bonk.ts";

const tactics: [TacticName, TacticType][] = [
  ["bonk", bonk],
];

export const tacticMap = new Map<TacticName, TacticType>(tactics);
export const tacticCollection = Array.from(tacticMap.keys());
