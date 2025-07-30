import { ReactNode, useReducer } from "react";
import { GameActions, GameType } from "../../types/game.ts";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";
import { ManeuverName } from "../../types/maneuvers.ts";
import { selectEnemies } from "./contextActions.ts";
import { WeaponName } from "../../types/weapons.ts";

export type ActionTypes =
  | {
      type: GameActions.SELECT_MANEUVER;
      payload: {
        maneuverSelected: boolean;
        maxTargets: number;
        maneuver: ManeuverName | undefined;
      };
    }
  | {
      type: GameActions.SELECT_WEAPON;
      payload: {
        allowWeapon: boolean;
        weapon: WeaponName | undefined;
      };
    }
  | { type: GameActions.SELECT_ENEMY; payload: string | null }
  | { type: GameActions.SYNC; payload: GameType };

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(gameReducer, {
    enableConfirmation: false,
    characters: [],
    gameId: "",
    maxEnemySelections: 0,
    selectedEnemyIds: [],
    selectedManeuver: undefined,
    selectedWeapon: undefined,
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
        enableConfirmation: action.payload.maneuverSelected,
        maxEnemySelections: action.payload.maxTargets,
        selectedManeuver: action.payload.maneuver,
      };
    }

    case GameActions.SELECT_WEAPON: {
      return {
        ...game,
        selectedTechnique: action.payload.weapon,
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
