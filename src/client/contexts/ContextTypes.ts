import { GameType } from "../../types/game.ts";
import { ManeuverType } from "../../types/equipables/actions.ts";
import { WeaponType } from "../../types/equipables/weapons.ts";

/* Game Types */
export type GameStateType = {
  data: GameType;
  client: GameClientType;
};

export type GameClientType = {
  enableConfirmation: boolean;
  maxEnemySelections: number;
  selectedEnemyIds: string[];
  selectedManeuver: ManeuverType | null;
  selectedWeapon: WeaponType | null;
};

export enum GameAction {
  PLAYER_ACTION = "PLAYER_ACTION",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  SYNC = "SYNC",
}

/* Dispatch Types */
export type GameActionType = BattleActionType | LobbyActionType;

/* Battle Dispatcher */
type BattleActionType =
  | {
      type: GameAction.PLAYER_ACTION;
      payload: Partial<GameClientType>;
    }
  | {
      type: GameAction.SYNC;
      payload: GameType;
    };

/* Lobby Dispatcher */
type LobbyActionType = {
  type: GameAction.SET_ERROR_MESSAGE;
  payload: {
    errorMessage: string;
  };
};
