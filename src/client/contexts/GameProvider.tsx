import { ReactNode, useReducer } from "react";
import { GameActions, GameType } from "../../types/game.ts";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";
import { ManeuverName } from "../../types/maneuvers.ts";
import { TechniqueName } from "../../types/techniques.ts";
import { selectEnemies } from "./contextActions.ts";

export type ActionTypes =
  | {
      type: GameActions.SELECT_MANEUVER;
      payload: {
        allowManeuverSelect: boolean;
        maxTargets: number;
        maneuver: ManeuverName | undefined;
      };
    }
  | {
      type: GameActions.SELECT_TECHNIQUE;
      payload: {
        allowTechniqueSelect: boolean;
        technique: TechniqueName | "none";
      };
    }
  | { type: GameActions.SELECT_ENEMY; payload: string | null }
  | { type: GameActions.SYNC; payload: GameType };

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    allowSelection: false,
    characters: [],
    gameId: "",
    maxEnemySelections: 0,
    selectedEnemyIds: [],
    selectedManeuver: undefined,
    selectedTechnique: "none",
    round: 1,
    turnNumber: 0,
    turnOrder: [],
  });

  return (
    <GameContext.Provider value={game}>
      <GameDispatchContext.Provider value={dispatch}>
        {children}
      </GameDispatchContext.Provider>
    </GameContext.Provider>
  );
};

function gameReducer(game: GameStateType, action: ActionTypes) {
  switch (action.type) {
    case GameActions.SELECT_MANEUVER: {
      return {
        ...game,
        allowSelection: action.payload.allowManeuverSelect,
        maxEnemySelections: action.payload.maxTargets,
        selectedManeuver: action.payload.maneuver,
      };
    }

    case GameActions.SELECT_TECHNIQUE: {
      return {
        ...game,
        allowSelection: action.payload.allowTechniqueSelect,
        selectedTechnique: action.payload.technique,
      };
    }

    case GameActions.SELECT_ENEMY: {
      return {
        ...game,
        selectedEnemyIds: selectEnemies(action.payload, game),
      };
    }

    case GameActions.SYNC: {
      return {
        ...game,
        ...action.payload,
      };
    }
  }
}
