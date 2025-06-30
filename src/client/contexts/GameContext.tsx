import { createContext, ReactNode, useReducer } from "react";
import { CharType, GameActions, GameType } from "../../types";

export type GameStateType = {
    characters: CharType[],
    selectedEnemyId: string;
}

type ActionTypes
    = { type: GameActions.ATTACK, payload: GameType }
    | { type: GameActions.SELECT, payload: string }
    | { type: GameActions.SYNC, payload: GameType }

export const GameContext = createContext<GameStateType | null>(null);
export const GameDispatchContext = createContext<any>(null);

export const GameProvider = ({children}: {children: ReactNode}) => {
    const [game, dispatch] = useReducer(gameReducer, {characters: [], selectedEnemyId: ""});

    return (
        <GameContext value={game}>
            <GameDispatchContext value={dispatch}>
                {children}
            </GameDispatchContext>
        </GameContext>
    );
};

function gameReducer(state: GameStateType, action: ActionTypes) {
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