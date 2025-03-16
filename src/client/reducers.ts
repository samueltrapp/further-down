import { CharacterDataType } from "../types";
import { GameStateType } from "./contexts/GameContext";

export enum GameActions {
    ATTACK = "ATTACK",
    SELECT = "SELECT",
    SYNC = "SYNC"
}

type ActionTypes
    = { type: GameActions.ATTACK, payload: CharacterDataType }
    | { type: GameActions.SELECT, payload: string }
    | { type: GameActions.SYNC, payload: CharacterDataType }

export function gameReducer(state: GameStateType, action: ActionTypes) {
    switch (action.type) {
        case GameActions.ATTACK: {
            return {
                ...state,
                characterData: action.payload
            };
        }
        case GameActions.SELECT: {
            return {
                ...state,
                selectedEnemyId: action.payload
            };
        }
        case GameActions.SYNC: {
            return {
                ...state,
                characterData: action.payload
            }
        }
    }
}