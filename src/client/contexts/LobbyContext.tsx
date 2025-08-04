import { ActionDispatch, createContext } from "react";
import { GameType } from "../../types/game.ts";
import { LobbyActionTypes } from "./LobbyProvider.tsx";

export type LobbyStateType = Pick<
  GameType,
  "gameId" | "lobbyStatus" | "pastEncounters" | "players"
> & {
  errorMsg: string;
};

export const LobbyContext = createContext<LobbyStateType | null>(null);
export const LobbyDispatchContext = createContext<ActionDispatch<
  [action: LobbyActionTypes]
> | null>(null);
