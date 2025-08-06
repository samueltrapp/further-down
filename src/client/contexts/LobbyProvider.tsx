import { ReactNode, useReducer } from "react";
import {
  LobbyContext,
  LobbyDispatchContext,
  LobbyStateType,
} from "./LobbyContext.tsx";
import { GameActions } from "../../types/game.ts";

export type LobbyActionTypes =
  | {
      type: GameActions.SET_ERROR_MESSAGE;
      payload: {
        errorMessage: string;
      };
    }
  | {
      type: GameActions.SYNC;
      payload: Partial<LobbyStateType>;
    };

export const LobbyProvider = ({ children }: { children: ReactNode }) => {
  const [lobby, dispatch] = useReducer(lobbyReducer, {
    errorMsg: "",
    gameId: "",
    pastEncounters: 0,
    players: [],
    startVotes: 0,
    status: "unjoined",
  });

  return (
    <LobbyContext.Provider value={lobby}>
      <LobbyDispatchContext.Provider value={dispatch}>
        {children}
      </LobbyDispatchContext.Provider>
    </LobbyContext.Provider>
  );
};

function lobbyReducer(lobby: LobbyStateType, action: LobbyActionTypes) {
  switch (action.type) {
    case GameActions.SET_ERROR_MESSAGE: {
      return {
        ...lobby,
        errorMsg: action.payload.errorMessage,
      };
    }
    case GameActions.SYNC: {
      return {
        ...lobby,
        ...action.payload,
      };
    }
    default: {
      return lobby;
    }
  }
}
