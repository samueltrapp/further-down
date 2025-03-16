import { createContext } from "react";
import { CharacterDataType } from "../../types";

export type GameStateType = {
    characterData: CharacterDataType,
    selectedEnemyId: string;
}

export const GameContext = createContext<GameStateType>({characterData: null, selectedEnemyId: ""});
export const GameDispatchContext = createContext(null);