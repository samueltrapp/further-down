import { ActionDispatch, createContext } from "react";
import { GameActionType } from "./ContextTypes.ts";
import { GameStateType } from "../../types/game.ts";

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<ActionDispatch<
  [action: GameActionType]
> | null>(null);
