import {TacticName, TacticType} from "../../../types/equipables/actions.ts";
import {bonk} from "./collection/bonk.ts";

const tactics: [TacticName, TacticType][] = [
  ["bonk", bonk],
];

export const tacticFns = new Map<TacticName, TacticType>(tactics);