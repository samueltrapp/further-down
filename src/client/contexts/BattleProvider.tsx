import { ReactNode, useReducer } from "react";
import { GameActions, GameType } from "../../types/game.ts";
import {
  BattleContext,
  BattleDispatchContext,
  BattleStateType,
} from "./BattleContext.tsx";
import { ManeuverName } from "../../types/maneuvers.ts";
import { selectEnemies } from "./contextActions.ts";
import { WeaponName } from "../../types/weapons.ts";

export type BattleActionTypes =
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
        weapon: WeaponName | undefined;
      };
    }
  | { type: GameActions.SELECT_ENEMY; payload: string | null }
  | { type: GameActions.SYNC; payload: GameType };

export const BattleProvider = ({ children }: { children: ReactNode }) => {
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
    <BattleContext.Provider value={game}>
      <BattleDispatchContext.Provider value={dispatch}>
        {children}
      </BattleDispatchContext.Provider>
    </BattleContext.Provider>
  );
};

function gameReducer(game: BattleStateType, action: BattleActionTypes) {
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
        selectedWeapon: action.payload.weapon,
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
