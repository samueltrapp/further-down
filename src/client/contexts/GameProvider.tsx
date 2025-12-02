import { GameContext, GameDispatchContext } from "./GameContext.tsx";
import { ReactNode, useReducer } from "react";
import { GameAction, GameActionType, GameStateType } from "./ContextTypes.ts";
import { LobbyStatus } from "../../types/game.ts";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    data: {
      battle: null,
      characters: {
        enemies: {},
        players: {},
      },
      lib: {
        armors: [],
        blessings: [],
        curses: [],
        enchantments: [],
        maneuvers: [],
        weapons: [],
      },
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
      selectedManeuver: null,
      selectedWeapon: null,
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
    case GameAction.LOG: {
      return {
        ...game,
        client: {
          ...game.client,
          logHistory: [...game.client.logHistory, ...action.payload],
        },
      };
    }
    default:
      return game;
  }
}
