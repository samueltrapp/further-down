import { GameContext, GameDispatchContext } from "./GameContext.tsx";
import { ReactNode, useReducer } from "react";
import { GameAction, GameActionType, GameStateType } from "./ContextTypes.ts";
import { LobbyStatus } from "../../types/game.ts";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    data: {
      battle: undefined,
      characters: {
        enemies: [],
        players: [],
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
        votes: 0,
        status: LobbyStatus.UNJOINED,
        pastEncounters: 0,
        errorMessage: undefined,
      },
    },
    client: {
      enableConfirmation: false,
      maxEnemySelections: 0,
      selectedEnemyIds: [],
      selectedManeuver: undefined,
      selectedWeapon: undefined,
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
    default:
      return game;
  }
}
