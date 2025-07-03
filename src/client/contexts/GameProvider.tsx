import { ReactNode, useReducer } from "react";
import { CharType, GameActions } from "../../types";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";

export type ActionTypes
    = { type: GameActions.ATTACK, payload: CharType[] }
    | { type: GameActions.SELECT, payload: string[] }
    | { type: GameActions.SYNC, payload: CharType[] }

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, dispatch] = useReducer(gameReducer, {
        characters: [],
        currentTurn: "",
        gameId: "",
        selectedEnemyIds: [],
        turnNumber: 0,
        turnOrder: []
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
        case GameActions.ATTACK: {
            return {
                ...game,
                characters: action.payload
            };
        }
        case GameActions.SELECT: {
            return {
                ...game,
                selectedEnemyIds: action.payload
            };
        }
        case GameActions.SYNC: {
            return {
                ...game,
                currentTurn: action.payload.reduce((a, b) => a.stats.speed > b.stats.speed ? a : b),
                characters: action.payload
            }
        }
    }
}