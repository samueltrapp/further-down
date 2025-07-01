import { ReactNode, useReducer } from "react";
import { CharType, GameActions } from "../../types";
import { GameContext, GameDispatchContext, GameStateType } from "./GameContext";

export type ActionTypes
    = { type: GameActions.ATTACK, payload: CharType[] }
    | { type: GameActions.SELECT, payload: string }
    | { type: GameActions.SYNC, payload: CharType[] }

export const GameProvider = ({children}: {children: ReactNode}) => {
    const [game, dispatch] = useReducer(gameReducer, {
        gameId: "",
        characters: [],
        selectedEnemyId: ""
    });

    return (
        <GameContext value={game}>
            <GameDispatchContext value={dispatch}>
                {children}
            </GameDispatchContext>
        </GameContext>
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
                selectedEnemyId: action.payload
            };
        }
        case GameActions.SYNC: {
            return {
                ...game,
                characters: action.payload
            }
        }
    }
}