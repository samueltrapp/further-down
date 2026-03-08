import { GameContext, GameDispatchContext } from "./GameContext.tsx";
import { ReactNode, useReducer } from "react";
import { GameAction, GameActionType } from "./ContextTypes.ts";
import {
  GameClientType,
  GameStateType,
  GameType,
  LobbyStatus,
} from "../../types/game.ts";

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    data: {
      battle: null,
      characters: null,
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
      maxSelections: 0,
      selectedIds: [],
      selectedManeuver: "",
      selectedWeapon: "",
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

function resetTurn(state: GameType): GameClientType {
  const turn = state?.battle?.turnOrder[0];
  const equippedWeapon = (() => {
    if (turn) {
      const character = state?.characters?.[turn];
      if (character && character?.team === "player") {
        return character?.equipped.weapon || "";
      }
    }
    return "";
  })();

  return {
    maxSelections: 0,
    selectedIds: [],
    selectedManeuver: "",
    selectedWeapon: equippedWeapon,
  };
}

function gameReducer(game: GameStateType, action: GameActionType) {
  switch (action.type) {
    case GameAction.SYNC:
      return {
        client: resetTurn(action.payload),
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
    default:
      return game;
  }
}
