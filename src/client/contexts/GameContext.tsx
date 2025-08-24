import { ActionDispatch, createContext } from "react";
import { GameActionType, GameStateType } from "./ContextTypes.ts";

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<ActionDispatch<
  [action: GameActionType]
> | null>(null);
