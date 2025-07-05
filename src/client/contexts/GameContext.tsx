import { ActionDispatch, createContext } from "react";
import { GameType } from "../../types/game.ts";
import { ActionTypes } from "./GameProvider";

export type GameStateType = GameType & {
    selectedEnemyIds: string[];
};

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<ActionDispatch<[action: ActionTypes]> | null>(null);