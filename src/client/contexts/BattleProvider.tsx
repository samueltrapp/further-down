import { ReactNode, useReducer } from "react";
import { BattleType, GameActions } from "../../types/game.ts";
import {
  BattleContext,
  BattleDispatchContext,
  BattleStateType,
} from "./BattleContext.tsx";
import { ManeuverName } from "../../types/equipables/maneuvers.ts";
import { selectEnemies } from "./contextActions.ts";
import { WeaponName } from "../../types/equipables/weapons.ts";

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
  | { type: GameActions.SYNC; payload: BattleType };

export const BattleProvider = ({ children }: { children: ReactNode }) => {
  const [game, dispatch] = useReducer(battleReducer, {
    round: 1,
    speedElapsed: 0,
    turnOrder: [],
    enableConfirmation: false,
    maxEnemySelections: 0,
    selectedEnemyIds: [],
    selectedManeuver: undefined,
    selectedWeapon: undefined,
  });

  return (
    <BattleContext.Provider value={game}>
      <BattleDispatchContext.Provider value={dispatch}>
        {children}
      </BattleDispatchContext.Provider>
    </BattleContext.Provider>
  );
};

function battleReducer(battle: BattleStateType, action: BattleActionTypes) {
  switch (action.type) {
    case GameActions.SELECT_MANEUVER: {
      return {
        ...battle,
        enableConfirmation: action.payload.maneuverSelected,
        maxEnemySelections: action.payload.maxTargets,
        selectedManeuver: action.payload.maneuver,
      };
    }

    case GameActions.SELECT_WEAPON: {
      return {
        ...battle,
        selectedWeapon: action.payload.weapon,
      };
    }

    case GameActions.SELECT_ENEMY: {
      return {
        ...battle,
        selectedEnemyIds: selectEnemies(action.payload, battle),
      };
    }

    case GameActions.SYNC: {
      return {
        ...battle,
        ...action.payload,
      };
    }

    default: {
      return battle;
    }
  }
}
