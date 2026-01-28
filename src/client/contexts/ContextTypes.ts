import { GameClientType, GameType } from "../../types/game.ts";

export enum GameAction {
  PLAYER_ACTION = "PLAYER_ACTION",
  SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE",
  SYNC = "SYNC",
  LOG = "LOG",
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
    }
  | {
      type: GameAction.LOG;
      payload: string[];
    };

/* Lobby Dispatcher */
type LobbyActionType = {
  type: GameAction.SET_ERROR_MESSAGE;
  payload: {
    errorMessage: string;
  };
};
