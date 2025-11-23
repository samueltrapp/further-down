import { CharactersType } from "../../../types/game.ts";
import { MnvOrTctFnType } from "../../../types/events/turn.ts";
import { bonkFn } from "./implementation/bonk.ts";
import { TacticName } from "../../../types/equipables/actions.ts";

type ResolvedTacticFnType = ({
  characters,
  sourceId,
  targetIds,
}: MnvOrTctFnType) => {
  characterResults: CharactersType;
  logResults: string[];
};

const tactics: [TacticName, ResolvedTacticFnType][] = [
  ["bonk", bonkFn],
  // ["sporeBurst", sporeBurst]
];

const tacticMap = new Map<TacticName, ResolvedTacticFnType>(tactics);

export const getTacticFn = (tactic: TacticName) => tacticMap.get(tactic);
