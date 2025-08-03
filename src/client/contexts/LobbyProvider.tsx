import { ReactNode, useReducer } from "react";
import {
  LobbyContext,
  LobbyDispatchContext,
  LobbyStateType,
} from "./LobbyContext.tsx";

export type LobbyActionTypes = {
  type: "ADD_PLAYER";
  payload: {
    playerId: string;
  };
};

export const LobbyProvider = ({ children }: { children: ReactNode }) => {
  const [lobby, dispatch] = useReducer(lobbyReducer, {
    gameId: "",
    hasStarted: false,
    playerCount: 0,
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
    case "ADD_PLAYER":
      return {
        ...lobby,
        playerCount: lobby.playerCount + 1,
      };
    default: {
      return lobby;
    }
  }
}
