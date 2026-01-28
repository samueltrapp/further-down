import { GameContext, GameDispatchContext } from "./GameContext.tsx";
import { ReactNode, useReducer } from "react";
import { GameAction, GameActionType } from "./ContextTypes.ts";
import { GameStateType, LobbyStatus } from "../../types/game.ts";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    data: {
      battle: null,
      characters: new Map(),
      lobby: {
        gameId: "",
        users: [],
        votes: [],
        status: LobbyStatus.UNJOINED,
        pastEncounters: 0,
        errorMessage: "",
      },
    },
    client: {
      enableConfirmation: false,
      maxEnemySelections: 0,
      selectedEnemyIds: [],
      selectedFriendlyIds: [],
      selectedManeuver: "",
      selectedWeapon: "",
      logHistory: [],
    },
  });

  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

function gameReducer(game: GameStateType, action: GameActionType) {
  switch (action.type) {
    case GameAction.SYNC:
      return {
        ...game,
        data: action.payload,
      };
    case GameAction.PLAYER_ACTION: {
      return {
        ...game,
        client: {
          ...game.client,
          ...action.payload,
        },
      };
    }
    // case GameAction.LOG: {
    //   return {
    //     ...game,
    //     client: {
    //       ...game.client,
    //       logHistory: [...game.client.logHistory, ...action.payload],
    //     },
    //   };
    // }
    default:
      return game;
  }
}
