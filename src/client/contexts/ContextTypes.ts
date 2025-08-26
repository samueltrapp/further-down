import { GameType } from "../../types/game.ts";
import {
  ManeuverName,
  ManeuverType,
} from "../../types/equipables/maneuvers.ts";
import { WeaponName, WeaponType } from "../../types/equipables/weapons.ts";

/* Game Types */
export type GameStateType = {
  data: GameType;
  client: GameClientType;
};

export type GameClientType = {
  enableConfirmation: boolean;
  maxEnemySelections: number;
  selectedEnemyIds: string[];
  selectedManeuver: ManeuverType | undefined;
  selectedWeapon: WeaponType | undefined;
};

export enum GameAction {
  SELECT_ENEMY = "SELECT_ENEMY",
  SELECT_MANEUVER = "SELECT_MANEUVER",
  SELECT_WEAPON = "SELECT_TECHNIQUE",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  SYNC = "SYNC",
}

/* Dispatch Types */
export type GameActionType = BattleActionType | LobbyActionType;

/* Battle Dispatcher */
type BattleActionType =
  | {
      type: GameAction.SELECT_MANEUVER;
      payload: {
        maneuverSelected: boolean;
        maxTargets: number;
        maneuver: ManeuverName | undefined;
      };
    }
  | {
      type: GameAction.SELECT_WEAPON;
      payload: {
        weapon: WeaponName | undefined;
      };
    }
  | { type: GameAction.SELECT_ENEMY; payload: string | null }
  | { type: GameAction.SYNC; payload: GameType };

/* Lobby Dispatcher */
type LobbyActionType = {
  type: GameAction.SET_ERROR_MESSAGE;
  payload: {
    errorMessage: string;
  };
};
