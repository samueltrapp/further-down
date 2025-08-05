import { ActionDispatch, createContext } from "react";
import { LobbyType } from "../../types/game.ts";
import { LobbyActionTypes } from "./LobbyProvider.tsx";

export type LobbyStateType = LobbyType & {
  errorMsg: string;
};

export const LobbyContext = createContext<LobbyStateType | null>(null);
export const LobbyDispatchContext = createContext<ActionDispatch<
  [action: LobbyActionTypes]
> | null>(null);
