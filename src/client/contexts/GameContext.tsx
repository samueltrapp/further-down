import { ActionDispatch, createContext } from "react";
import { GameType } from "../../types";
import { ActionTypes } from "./GameProvider";

export type GameStateType = GameType & {
    selectedEnemyIds: string[];
};

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<ActionDispatch<[action: ActionTypes]> | null>(null);