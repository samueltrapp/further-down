import {TacticName} from "../../../types/equipables/tactics.ts";
import {CharactersType} from "../../../types/game.ts";
import {MnvOrTctFnType} from "../../../types/events/turn.ts";
import {bonkFn} from "./implementation/bonk.ts";

type ResolvedTacticFnType = ({characters, sourceId, targetIds}: MnvOrTctFnType) => {characters: CharactersType, logMessages: string[]};

const tactics = [
  ["bonk", bonkFn],
  // ["sporeBurst", sporeBurst]
];

const tacticMap = new Map<TacticName, ResolvedTacticFnType>(tactics);

export const getTacticFn = (tactic: TacticName) => tacticMap.get(tactic);