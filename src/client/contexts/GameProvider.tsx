import { ReactNode, useReducer } from "react";
import {CharType, GameActions, GameType} from "../../types/game.ts";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";

export type ActionTypes
    = { type: GameActions.ATTACK, payload: CharType[] }
    | { type: GameActions.SELECT, payload: string[] }
    | { type: GameActions.SYNC, payload: GameType }

export const GameProvider = ({ children }: { children: ReactNode }) => {
    const [game, dispatch] = useReducer(gameReducer, {
        characters: [],
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
                selectedEnemyIds: game.selectedEnemyIds,
                ...action.payload
            }
        }
    }
}